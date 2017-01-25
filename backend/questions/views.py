"""Defines all views related to questions."""
from flask import request, jsonify
from flask import session
from flask_login import current_user
from flask_socketio import join_room, emit, Namespace
from sqlalchemy import or_
from sqlalchemy import sql
from sqlalchemy.orm import joinedload

from authentication.models import User
from base.views import ApiView, register_api
from database import db_session
from errors import invalid_json
from errors.http import NotFoundException, BadRequestException, ForbiddenException
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
        if current_user.is_authenticated:
            return Question.query.filter(User.rooms.any(User.id == current_user.id))
        if session.get("rooms") is not None:
            return Question.query.filter(Room.id.in_(session.get("rooms")))
        return Question.query.filter(sql.false())

    def check_object_permissions(self, obj, method):
        if method in ["POST", "DELETE", "PUT"]:
            if obj.poll.room.owner != current_user:
                raise ForbiddenException()
        else:
            if (current_user.is_authenticated and current_user not in obj.poll.room.participants) or \
                    (current_user.is_anonymous and obj.poll.room.id not in session.get("rooms")):
                raise ForbiddenException()


def answer_question(_id):
    # FIXME : this could be done in a smarter way, without redoing everything
    question = Question.query \
        .filter(Question.id == _id) \
        .filter(Question.is_open) \
        .one_or_none()

    if question is None or not question.poll.visible or \
            (current_user.is_authenticated and current_user not in question.poll.room.participants) or \
            (current_user.is_anonymous and question.poll.room_id not in session.get("rooms", [])):
        raise NotFoundException()

    try:
        data = request.json
        data = list(map(int, data))
    except Exception:
        raise BadRequestException(invalid_json)

    if question.type == QuestionType.UNIQUE and len(data) != 1:
        raise BadRequestException(invalid_json)

    if current_user.is_authenticated:
        Answer.query.filter(Answer.user_id == current_user.id) \
            .filter(Answer.choice_id.in_(db_session.query(Choice.id).filter(Choice.question_id == question.id))) \
            .delete(synchronize_session="fetch")

        for answer in data:
            db_session.add(Answer(user_id=current_user.id, choice_id=answer))
    else:
        Answer.query.filter(Answer.anonymous_id == session["id"]) \
            .filter(Answer.choice_id.in_(db_session.query(Choice.id).filter(Choice.question_id == question.id))) \
            .delete(synchronize_session="fetch")

        for answer in data:
            db_session.add(Answer(anonymous_id=session["id"], choice_id=answer))

    db_session.commit()

    # FIXME : using a signal would be cleaner
    socketio.emit("item", question.id, namespace="/questions", room=question.poll_id)

    return jsonify({}), 200


class QuestionsNamespace(Namespace):
    """Defines Socket.IO operations for polls."""

    def on_connect(self):
        """Check that the user is authenticated and registers him to its polls."""
        if current_user.is_authenticated:
            polls = Poll.query \
                .filter(User.rooms.any(User.id == current_user.id)) \
                .filter(or_(Poll.visible.is_(True), Room.owner_id == current_user.id)).all()
        else:
            if session.get("rooms") is not None:
                polls = Poll.query \
                    .filter(Room.id.in_(session.get("rooms"))) \
                    .filter(Poll.visible.is_(True)).all()
            else:
                polls = []

        for poll in polls:
            join_room(poll.id)

    def on_join(self, _id):
        """
        Make the user join the room identified by the given token.

        :param _id: token of the room
        """
        poll = Poll.query.get(_id)

        if poll.visible or poll.room.owner == current_user:
            join_room(_id)
            for question in poll.questions:
                emit("item", question.id)


register_api(QuestionApiView, "questions", "/questions/")
app.add_url_rule("/questions/<int:_id>/answer/", "answer_question", answer_question, methods=["POST"])
socketio.on_namespace(QuestionsNamespace("/questions"))
