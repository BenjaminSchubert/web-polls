"""Defines all views related to polls."""
from flask import jsonify
from flask import request
from flask import session
from flask_login import current_user
from flask_socketio import join_room, emit, Namespace
from sqlalchemy import or_, sql
from sqlalchemy.orm import joinedload

from authentication.models import User
from base.views import ApiView, register_api
from database import db_session
from errors.http import ForbiddenException
from polls.forms import PollForm
from polls.models import Poll, PollType
from questions import Question
from rooms import Room
from runserver import socketio, app

__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class PollApiView(ApiView):
    """Defines views related to polls."""

    model = Poll

    def get_form(self):
        """Get the form to create or update a poll."""
        return PollForm(type=PollType.MANUAL.name)

    @property
    def queryset(self):
        """Get the query on which to work."""
        if current_user.is_authenticated:
            return Poll.query.filter(User.rooms.any(User.id == current_user.id))
        if session.get("rooms") is not None:
            return Poll.query.filter(Poll.room_id.in_(session.get("rooms")))
        return Poll.query.filter(sql.false())

    def check_object_permissions(self, obj, method):
        if method in ["POST", "DELETE", "PUT"]:
            if obj.room.owner != current_user:
                raise ForbiddenException()
        else:
            if (current_user.is_authenticated and current_user not in obj.room.participants) or \
                    (current_user.is_anonymous and obj.room.id not in session.get("rooms")):
                raise ForbiddenException()


def open_poll(_id):
    if Poll.query.filter(Room.owner_id == current_user.id).filter(Poll.id == _id).one_or_none() is None:
        return jsonify({}), 404

    try:
        open = request.json["open"]
    except KeyError:
        return jsonify({"open": "missing key"}), 400

    for question in Question.query.options(joinedload("choices")).filter(Question.poll_id == _id):
        question.is_open = open

    db_session.commit()
    return jsonify({}), 200


class PollsNamespace(Namespace):
    """Defines Socket.IO operations for polls."""

    def on_connect(self):
        """Check that the user is authenticated and registers him to its polls."""
        if current_user.is_authenticated:
            rooms = Room.query.filter(User.rooms.any(User.id == current_user.id)).all()
        elif session.get("rooms") is not None:
            rooms = Room.query.filter(Room.id.in_(session["rooms"]))
        else:
            rooms = []

        for room in rooms:
            if current_user == room.owner:
                join_room("{}-admin".format(room.id))
            else:
                join_room(room.id)

    def on_join(self, _id):
        """
        Make the user join the room identified by the given token.

        :param _id: id of the room to join
        """
        room = Room.query.get(_id)

        if room.owner == current_user:
            join_room("{}-admin".format(_id))
        else:
            join_room(_id)

        if current_user.is_authenticated:
            polls = Poll.query \
                .filter(Room.id == room.id) \
                .filter(or_(Poll.visible.is_(True), Room.owner == current_user)).all()
        else:
            polls = Poll.query \
                .filter(Room.id == room.id) \
                .filter(Poll.visible.is_(True)).all()

        for poll in polls:
            emit("item", poll.id)


app.add_url_rule("/polls/<int:_id>/open/", "open_polls", open_poll, methods=["POST"])
register_api(PollApiView, "polls", "/polls/")
socketio.on_namespace(PollsNamespace("/polls"))
