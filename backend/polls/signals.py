"""Defines various signal for the handling of polls."""

from database import DBSignals
from polls import Poll
from runserver import socketio


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


@DBSignals.new.connect_via(Poll)
def new_poll(sender, object, *args, **kwargs):
    """
    Notify users that a new poll was created in one of their room.

    :param object: newly created poll
    :param args: additional arguments
    :param kwargs: additional keyword arguments
    """
    if object.visible:
        room = object.room_id
    else:
        room = "{}-admin".format(object.room_id)

    socketio.emit("item", object, namespace="/polls", room=room)
