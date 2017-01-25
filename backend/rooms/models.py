"""Defines models related to rooms."""

import string
from sqlite3 import IntegrityError

import random
from blinker import Namespace
from flask import request
from flask_login import current_user
from sqlalchemy import Column, INTEGER, VARCHAR, ForeignKey, Table
from sqlalchemy.orm import relationship

from base.models import SerializableMixin
from database import Base


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"

participants_in_room = Table(
    "participants_in_room",
    Base.metadata,
    Column("user_id", INTEGER, ForeignKey("users.id")),
    Column("room_id", INTEGER, ForeignKey("rooms.id"))
)

namespace = Namespace()
deleted = namespace.signal("deleted")


class Room(SerializableMixin, Base):
    """Defines a model for rooms."""

    __tablename__ = "rooms"
    __excluded__ = set("owner_id")

    id = Column(INTEGER, primary_key=True)
    name = Column(VARCHAR(255))
    token = Column(VARCHAR(6), unique=True)
    owner_id = Column(INTEGER, ForeignKey("users.id"))
    owner = relationship("User")

    participants = relationship("User", secondary=participants_in_room, backref="rooms")

    def as_dict(self):
        """Get the object as a dictionary."""
        base = super().as_dict()
        base["owning"] = current_user.is_authenticated and self.owner_id == current_user.id
        return base

    def set_token(self, session, size=6):
        """
        Create a random token to identify the room.

        :param session: session to use to commit the changes
        :param size: size of the token to generate
        """
        e = None
        for i in range(1000):
            try:
                self.token = "".join(random.choice(string.ascii_uppercase + string.digits) for _ in range(size))
                session.commit()
            except IntegrityError as exc:
                e = exc
            else:
                return
        raise e
