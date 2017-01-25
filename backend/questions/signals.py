"""Defines various signal for the handling of polls."""

from database import DBSignals
from polls import Poll
from questions import Question
from runserver import socketio


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


@DBSignals.new.connect_via(Question)
def new_question(sender, object, *args, **kwargs):
    """
    Notify users that a new question was added in one of their polls

    :param object: newly created question
    :param args: additional arguments
    :param kwargs: additional keyword arguments
    """
    socketio.emit("item", object.id, namespace="/questions", room=object.poll_id)


@DBSignals.changed.connect_via(Question)
def updated_question(sender, object, *args, **kwargs):
    # FIXME : we should filter depending on whether the poll is visible or not
    socketio.emit("item", object.id, namespace="/questions", room=object.poll_id)


@DBSignals.deleted.connect_via(Question)
def signal_deleted_question(sender, object, *args, **kwargs):
    """
    Notify users that a question was destroyed

    :param object: the question deleted
    :param args: additional arguments
    :param kwargs: additional keyword arguments
    """
    socketio.emit("delete", object.id, namespace="/questions", room=object.poll_id)
