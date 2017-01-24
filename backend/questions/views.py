"""Defines all views related to questions."""
from flask import request, jsonify
from flask_login import current_user
from flask_socketio import join_room, emit, Namespace
from sqlalchemy import or_
from sqlalchemy.orm import joinedload

from authentication.models import User
from base.views import ApiView, register_api
from database import db_session
from errors import invalid_json
from errors.http import NotFoundException, BadRequestException
from polls.models import Poll
from questions import Question, Choice, Answer, QuestionType
from questions.forms import QuestionForm
from rooms import Room
from runserver import socketio, app

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


def answer_question(_id):
    # FIXME : this could be done in a smarter way, without redoing everything
    question = Question.query.options(joinedload("choices")) \
        .filter(Question.id == _id) \
        .filter(Question.is_open) \
        .one_or_none()

    if question is None:
        raise NotFoundException()

    try:
        data = request.json
        data = list(map(int, data))
    except Exception:
        raise BadRequestException(invalid_json)

    if question.type == QuestionType.UNIQUE and len(data) != 1:
        raise BadRequestException(invalid_json)

    Answer.query.filter(Answer.user_id == current_user.id) \
        .filter(Answer.choice_id.in_(db_session.query(Choice.id).filter(Choice.question_id == question.id))) \
        .delete(synchronize_session="fetch")

    for answer in data:
        db_session.add(Answer(user_id=current_user.id, choice_id=answer))
    db_session.commit()

    return jsonify({}), 200


class QuestionsNamespace(Namespace):
    """Defines Socket.IO operations for polls."""

    def on_connect(self):
        """Check that the user is authenticated and registers him to its polls."""
        if not current_user.is_authenticated:
            return

        polls = Poll.query.join(Question) \
            .join(Choice) \
            .filter(User.rooms.any(User.id == current_user.id)) \
            .filter(or_(Poll.visible, Room.owner_id == current_user.id)).all()

        for poll in polls:
            join_room(poll.id)

        emit("list", [question for poll in polls for question in poll.questions])

    def on_join(self, _id):
        """
        Make the user join the room identified by the given token.

        :param _id: token of the room
        """
        poll = Poll.query.get(_id)

        if poll.visible or poll.room.owner == current_user:
            join_room(_id)


register_api(QuestionApiView, "questions", "/questions/")
app.add_url_rule("/questions/<int:_id>/answer/", "answer_question", answer_question, methods=["POST"])
socketio.on_namespace(QuestionsNamespace("/questions"))
