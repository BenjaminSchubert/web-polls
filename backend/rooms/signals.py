"""Defines various signal for the handling of rooms."""

from database import DBSignals
from rooms import Room
from runserver import socketio


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


@DBSignals.deleted.connect_via(Room)
def disconnect_deleted_room(sender, object, *args, **kwargs):
    """
    Disconnect all users from the room that was just deleted.

    :param object: the room deleted
    :param args: additional arguments
    :param kwargs: additional keyword arguments
    """
    socketio.emit("delete", object.id, namespace="/rooms", room=object.id)
    socketio.close_room(object.id, namespace="/rooms")
