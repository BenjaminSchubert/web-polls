"""Defines models related to the user scheme."""

from flask_login import UserMixin
from sqlalchemy import Column, INTEGER, VARCHAR
from sqlalchemy.orm import validates

from base.models import SerializableMixin
from base.models.types import Hash
from database import Base


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class User(UserMixin, SerializableMixin, Base):
    """Defines a base User model."""

    __tablename__ = "users"
    __excluded__ = {"password"}

    id = Column(INTEGER, primary_key=True)
    username = Column(VARCHAR, unique=True)
    email = Column(VARCHAR, unique=True)
    password = Column(Hash(iterations=30000, salt_length=12))  # FIXME : add to configuration

    @validates("password")
    def validate_password(self, key: str, password: str) -> Hash:
        """
        Validate that the given password is a valid password and hashes it.

        :param key: name of the attribute
        :param password: value of the password
        :return: the new hashed password
        """
        return getattr(type(self), key).type.convert(password)
