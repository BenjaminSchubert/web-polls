"""Defines models related to polls."""

import enum

from sqlalchemy import BOOLEAN
from sqlalchemy import Column, INTEGER, VARCHAR, ForeignKey, Enum
from sqlalchemy import TEXT
from sqlalchemy import TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.orm import validates

from base.models import SerializableMixin
from database import Base


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class PollType(SerializableMixin, enum.Enum):
    """Defines all types a poll can have."""

    MANUAL = "manual"

    def as_dict(self):
        return self.name


class Poll(SerializableMixin, Base):
    """Defines a model for rooms."""

    __tablename__ = "polls"

    id = Column(INTEGER, primary_key=True)
    description = Column(TEXT)
    name = Column(VARCHAR(255))
    type = Column(Enum(PollType))
    is_open = Column(BOOLEAN, default=False)
    visible = Column(BOOLEAN, default=False)
    room_id = Column(INTEGER, ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False)
    room = relationship("Room")

    _visible = None

    @validates("visible")
    def save_old_visible_value(self, key, new_value):
        if new_value != self.visible:
            self._visible = self.visible

        return new_value
