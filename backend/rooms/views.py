"""Defines all views related to rooms."""

from flask_login import current_user
from flask_socketio import Namespace, emit, join_room
from sqlalchemy.orm.exc import NoResultFound

from authentication.models import User
from base.views import ApiView, register_api
from errors import invalid_room_token
from rooms.forms import RoomCreationForm
from rooms.models import Room
from runserver import db_session, socketio


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class RoomApiView(ApiView):
    """Defines views related to rooms."""

    model = Room

    @property
    def queryset(self):
        """Get the query on which to work."""
        return Room.query.join(Room.participants).filter(User.rooms.any(User.id == current_user.id))

    def get_form(self):
        """Get the form to create or update an object."""
        return RoomCreationForm(owner=current_user)


class RoomNamespace(Namespace):
    """Defines Socket.IO operations for rooms."""

    def on_connect(self):
        """Check that the user is authenticated and registers him to its rooms."""
        if not current_user.is_authenticated:
            return

        rooms = Room.query.join(Room.participants).filter(User.rooms.any(User.id == current_user.id)).all()

        for room in rooms:
            join_room(room.id)
        emit("list", rooms)

    def on_join(self, token):
        """
        Make the user join the room identified by the given token.

        :param token: token of the room
        """
        try:
            room = Room.query.filter(Room.token == token).join(Room.participants).one()
        except NoResultFound:
            return {"code": invalid_room_token}

        if current_user.is_authenticated:
            if current_user not in room.participants:
                room.participants.append(current_user)
                db_session.commit()

        join_room(room.id)
        emit("item", room)


register_api(RoomApiView, "rooms", "/rooms/")
socketio.on_namespace(RoomNamespace("/rooms"))
