"""Defines all views related to rooms."""
from flask import jsonify
from flask import session
from flask_login import current_user
from flask_socketio import Namespace, emit, join_room
from sqlalchemy import sql
from sqlalchemy.orm.exc import NoResultFound

from authentication.models import User
from base.views import ApiView, register_api
from database import db_session
from errors import invalid_room_token, room_already_joined
from errors.http import ForbiddenException
from rooms.forms import RoomForm
from rooms.models import Room
from runserver import socketio, app

__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class AlreadyJoinedException(Exception):
    pass


def _join_room(token):
    room = Room.query.filter(Room.token == token).one()

    if current_user.is_authenticated:
        if current_user not in room.participants:
            room.participants.append(current_user)
            db_session.commit()
            return room.id
        else:
            raise AlreadyJoinedException()
    else:
        if session.get("rooms") is None:
            session["rooms"] = []

        if room.id in session["rooms"]:
            raise AlreadyJoinedException()
        session["rooms"].append(room.id)
        session.modified = True
        return room.id


class RoomApiView(ApiView):
    """Defines views related to rooms."""

    model = Room

    @property
    def queryset(self):
        """Get the query on which to work."""
        if current_user.is_authenticated:
            return Room.query.filter(User.rooms.any(User.id == current_user.id))

        if session.get("rooms") is not None:
            return Room.query.filter(Room.id.in_(session.get("rooms")))
        return Room.query.filter(sql.false())

    def check_object_permissions(self, obj, method):
        if method in ["POST", "DELETE", "PUT"]:
            if obj.owner != current_user:
                raise ForbiddenException()

    def get_form(self, obj=None):
        """Get the form to create or update a room."""
        return RoomForm(obj=obj, owner=current_user)


def join_room_view(token):
    try:
        return jsonify({"id": _join_room(token)})
    except NoResultFound:
        return jsonify({"code": [invalid_room_token]}), 400
    except AlreadyJoinedException:
        return jsonify({"code": [room_already_joined]}), 400


def quit_room(room_id):
    room = Room.query.join(Room.participants).filter(Room.id == room_id).one_or_none()

    if room is not None and current_user.is_authenticated:
        room.participants.remove(current_user)
        db_session.commit()

    return jsonify({"id": room_id})


class RoomNamespace(Namespace):
    """Defines Socket.IO operations for rooms."""

    def on_connect(self):
        """Check that the user is authenticated and registers him to its rooms."""
        if not current_user.is_authenticated:
            if session.get("rooms") is not None:
                rooms = Room.query.filter(Room.id.in_(session.get("rooms"))).all()
            else:
                rooms = []
        else:
            rooms = Room.query.filter(User.rooms.any(User.id == current_user.id)).all()

        for room in rooms:
            join_room(room.id)

    def on_join(self, token):
        """
        Make the user join the room identified by the given token.

        :param token: token of the room
        """
        try:
            _id = _join_room(token)
            join_room(_id)
            emit("item", _id)
            return {"id": _id}
        except NoResultFound:
            return {"code": [invalid_room_token]}
        except AlreadyJoinedException:
            return {"code": [room_already_joined]}


app.add_url_rule("/rooms/join/<string:token>", "join_room", join_room_view, methods=["POST"])
app.add_url_rule("/rooms/<int:room_id>/quit/", "quit_room", quit_room, methods=["POST"])
register_api(RoomApiView, "rooms", "/rooms/")
socketio.on_namespace(RoomNamespace("/rooms"))
