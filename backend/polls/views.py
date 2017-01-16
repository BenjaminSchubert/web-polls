"""Defines all views related to rooms."""

from flask_login import current_user
from flask_socketio import join_room, emit, Namespace
from sqlalchemy import or_

from authentication.models import User
from base.views import ApiView, register_api
from polls.forms import PollForm
from polls.models import Poll, PollType
from rooms import Room
from runserver import socketio


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class PollApiView(ApiView):
    """Defines views related to rooms."""

    model = Poll

    def get_form(self):
        """Get the form to create or update a poll."""
        return PollForm(type=PollType.MANUAL.name)

    @property
    def queryset(self):
        """Get the query on which to work."""
        return Poll.query.join(Room).join(Room.participants).filter(User.rooms.any(User.id == current_user.id))


class PollsNamespace(Namespace):
    """Defines Socket.IO operations for polls."""

    def on_connect(self):
        """Check that the user is authenticated and registers him to its polls."""
        if not current_user.is_authenticated:
            return

        rooms = Room.query.join(Room.participants).filter(User.rooms.any(User.id == current_user.id)).all()

        for room in rooms:
            join_room(room.id)

            if current_user == room.owner:
                join_room("{}-admin".format(room.id))

        polls = Poll.query \
            .join(Room) \
            .filter(User.rooms.any(User.id == current_user.id)) \
            .filter(or_(Poll.visible.is_(True), Room.owner == current_user)).all()

        emit("list", polls)

    def on_join(self, _id):
        """
        Make the user join the room identified by the given token.

        :param token: token of the room
        """
        room = Room.query.get(_id)

        if room.owner == current_user:
            join_room("{}-admin".format(_id))
        join_room(_id)


register_api(PollApiView, "polls", "/polls/")
socketio.on_namespace(PollsNamespace("/polls"))
