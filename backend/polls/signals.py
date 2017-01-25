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
        socketio.emit("item", object.id, namespace="/polls", room=object.room_id)
    socketio.emit("item", object.id, namespace="/polls", room="{}-admin".format(object.room_id))


@DBSignals.changed.connect_via(Poll)
def updated_poll(sender, object, *args, **kwargs):
    """

    :param sender:
    :param object:
    :param args:
    :param kwargs:
    :return:
    """
    if not object.visible:
        if object._visible:  # the object was visible but is not anymore
            socketio.emit("delete", object.id, namespace="/polls", room=object.room_id)

    else:
        socketio.emit("item", object.id, namespace="/polls", room=object.room_id)

    socketio.emit("item", object.id, namespace="/polls", room="{}-admin".format(object.room_id))


@DBSignals.deleted.connect_via(Poll)
def signal_deleted_poll(sender, object, *args, **kwargs):
    """
    Notify users that the poll was destroyed

    :param object: the poll deleted
    :param args: additional arguments
    :param kwargs: additional keyword arguments
    """
    if object.visible:
        socketio.emit("delete", object.id, namespace="/polls", room=object.room_id)
    socketio.emit("delete", object.id, namespace="/polls", room="{}-admin".format(object.room_id))
