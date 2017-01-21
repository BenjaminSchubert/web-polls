"""Defines various signal for the handling of polls."""

from database import DBSignals
from polls import Poll
from questions import Question
from runserver import socketio


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


@DBSignals.new.connect_via(Question)
def new_poll(sender, object, *args, **kwargs):
    """
    Notify users that a new question was added in one of their polls

    :param object: newly created question
    :param args: additional arguments
    :param kwargs: additional keyword arguments
    """
    socketio.emit("item", object, namespace="/questions", room=object.poll_id)


#@DBSignals.deleted.connect_via(Poll)
def signal_deleted_poll(sender, object, *args, **kwargs):
    """
    Notify users that the poll was destroyed

    :param object: the poll deleted
    :param args: additional arguments
    :param kwargs: additional keyword arguments
    """
    socketio.emit("delete", object.id, namespace="/polls", room=object.room_id)
