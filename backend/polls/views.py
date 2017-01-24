"""Defines all views related to polls."""
from flask import jsonify
from flask import request
from flask_login import current_user
from flask_socketio import join_room, emit, Namespace
from sqlalchemy import or_
from sqlalchemy.orm import joinedload

from authentication.models import User
from base.views import ApiView, register_api
from database import db_session
from polls.forms import PollForm
from polls.models import Poll, PollType
from questions import Question, Choice
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
        return Poll.query.join(Room).join(Room.participants).filter(User.rooms.any(User.id == current_user.id))


def open_poll(_id):
    if Poll.query.join(Room).filter(Room.owner_id == current_user.id).filter(Poll.id == _id).one_or_none() is None:
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
        if not current_user.is_authenticated:
            return

        rooms = Room.query.join(Room.participants).filter(User.rooms.any(User.id == current_user.id)).all()

        for room in rooms:
            if current_user == room.owner:
                join_room("{}-admin".format(room.id))
            else:
                join_room(room.id)

        polls = Poll.query \
            .join(Room) \
            .filter(User.rooms.any(User.id == current_user.id)) \
            .filter(or_(Poll.visible.is_(True), Room.owner == current_user)).all()

        emit("list", polls)

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


app.add_url_rule("/polls/<int:_id>/open/", "open_polls", open_poll, methods=["POST"])
register_api(PollApiView, "polls", "/polls/")
socketio.on_namespace(PollsNamespace("/polls"))
