"""Defines models related to questions."""

import enum

from sqlalchemy import BOOLEAN
from sqlalchemy import Column, INTEGER, ForeignKey, Enum
from sqlalchemy import TEXT
from sqlalchemy import VARCHAR
from sqlalchemy.orm import relationship, backref

from base.models import SerializableMixin
from database import Base


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class QuestionType(SerializableMixin, enum.Enum):
    """Defines all types a question can be."""

    MULTIPLE = "multiple"
    UNIQUE = "unique"

    def as_dict(self):
        return self.name


class Question(SerializableMixin, Base):
    """Defines a model for rooms."""

    __tablename__ = "questions"

    id = Column(INTEGER, primary_key=True)
    title = Column(TEXT)
    type = Column(Enum(QuestionType))
    is_open = Column(BOOLEAN, default=False)
    poll_id = Column(INTEGER, ForeignKey("polls.id", ondelete="CASCADE"), nullable=False)
    poll = relationship("Poll", backref=backref("questions", cascade="all, delete-orphan"))

    def as_dict(self):
        obj = super().as_dict()
        obj["choices"] = self.choices
        return obj


class Choice(SerializableMixin, Base):
    """"""

    __tablename__ = "choices"

    id = Column(INTEGER, primary_key=True)
    text = Column(VARCHAR(length=255))
    question_id = Column(INTEGER, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    question = relationship("Question", backref=backref("choices", cascade="all, delete-orphan"))


class Answer(SerializableMixin, Base):
    """"""

    __tablename__ = "answers"

    id = Column(INTEGER, primary_key=True)

    choice_id = Column(INTEGER, ForeignKey("choices.id", ondelete="CASCADE"), nullable=False)
    choice = relationship("Choice", backref="answers")

    user_id = Column(INTEGER, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    user = relationship("User")
