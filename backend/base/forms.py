"""This module declares base forms to use in APIs."""

from typing import Callable

from abc import abstractmethod
from flask_wtf import FlaskForm
from sqlalchemy.exc import IntegrityError

from database import db_session


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class UniqueConstraintFail(Exception):
    """Exception thrown when a unique constraint fails."""

    def __init__(self, field):
        """
        Create a new exception.

        :param field: field on which the constraint failed
        """
        self.field = field


class ApiForm(FlaskForm):
    """
    Form to handle the creation and update of objects.

    This class extends `FlaskForm` to allow to create and save the object automatically.
    """

    @property
    @abstractmethod
    def model(self) -> Callable:
        """Get the form's model used to create the object."""

    def save(self):
        """Save the current form data an a new object."""
        obj = self.model()
        self.populate_obj(obj)

        try:
            db_session.commit()
        except IntegrityError as e:
            origin = str(e.orig).lower()
            if "unique" in origin:
                # this is very likely a unique constraint fail
                field = origin.split(":")[-1].split(".")[-1]
                raise UniqueConstraintFail(field)
            raise

        return obj
