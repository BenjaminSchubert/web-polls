"""Defines all views related to questions."""

from flask_login import current_user
from flask_socketio import join_room, emit, Namespace
from sqlalchemy import or_

from authentication.models import User
from base.views import ApiView, register_api
from polls.models import Poll
from questions import Question
from questions.forms import QuestionForm
from rooms import Room
from runserver import socketio


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class QuestionApiView(ApiView):
    """Defines views related to questions."""

    model = Question

    def get_form(self):
        """Get the form to create or update a poll."""
        return QuestionForm()

    @property
    def queryset(self):
        """Get the query on which to work."""
        return Question.query \
            .join(Poll) \
            .join(Room) \
            .join(Room.participants) \
            .filter(User.rooms.any(User.id == current_user.id))


class QuestionsNamespace(Namespace):
    """Defines Socket.IO operations for polls."""

    def on_connect(self):
        """Check that the user is authenticated and registers him to its polls."""
        if not current_user.is_authenticated:
            return

        polls = Poll.query.join(Question)\
            .filter(User.rooms.any(User.id == current_user.id))\
            .filter(or_(Poll.visible, Room.owner_id == current_user.id)).all()

        for poll in polls:
            join_room(poll.id)

        emit("list", [question for poll in polls for question in poll.questions])

    def on_join(self, _id):
        """
        Make the user join the room identified by the given token.

        :param token: token of the room
        """
        poll = Poll.query.get(_id)

        if poll.visible or poll.room.owner == current_user:
            join_room(_id)


register_api(QuestionApiView, "questions", "/questions/")
socketio.on_namespace(QuestionsNamespace("/questions"))
