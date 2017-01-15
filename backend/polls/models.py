"""Defines models related to polls."""

import enum

from sqlalchemy import BOOLEAN
from sqlalchemy import Column, INTEGER, VARCHAR, ForeignKey, Enum
from sqlalchemy import TEXT
from sqlalchemy import TIMESTAMP
from sqlalchemy.orm import relationship

from base.models import SerializableMixin
from database import Base


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class PollType(enum.Enum):
    """Defines all types a poll can have."""

    MANUAL = "manual"


class Poll(SerializableMixin, Base):
    """Defines a model for rooms."""

    __tablename__ = "polls"

    id = Column(INTEGER, primary_key=True)
    description = Column(TEXT)
    name = Column(VARCHAR(255))
    type = Enum(PollType)
    open_until = Column(TIMESTAMP, default=None)
    visible = Column(BOOLEAN, default=False)
    room_id = Column(INTEGER, ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False)
    room = relationship("Room")
