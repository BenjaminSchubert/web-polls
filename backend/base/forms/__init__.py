"""This module declares base forms to use in APIs."""

from typing import Callable

from abc import abstractmethod
from flask import request
from flask_wtf.form import _is_submitted, _Auto
from flask_wtf import FlaskForm
from sqlalchemy.exc import IntegrityError
import wtforms_json
from werkzeug.datastructures import ImmutableMultiDict

from database import db_session


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


wtforms_json.init()


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

    class Meta(FlaskForm.Meta):
        def wrap_formdata(self, form, formdata):
            if formdata is _Auto:
                if _is_submitted():
                    return ImmutableMultiDict(wtforms_json.flatten_json(form.__class__, request.get_json()))
            return super().wrap_formdata(form, formdata)

    @property
    @abstractmethod
    def model(self) -> Callable:
        """Get the form's model used to create the object."""

    def save(self):
        """Save the current form data an a new object."""
        obj = self.model()
        self.populate_obj(obj)

        db_session.add(obj)

        try:
            db_session.commit()
        except IntegrityError as e:
            self.check_integrity_error(e)

        return obj

    def check_integrity_error(self, exception: IntegrityError):
        origin = str(exception.orig).lower()
        if "unique" in origin:
            # this is very likely a unique constraint fail
            field = origin.split(":")[-1].split(".")[-1]
            raise UniqueConstraintFail(field)
        raise exception
