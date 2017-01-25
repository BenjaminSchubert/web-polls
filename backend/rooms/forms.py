"""Defines forms related to rooms."""

from flask_login import current_user
from sqlalchemy.exc import IntegrityError
from wtforms import StringField

from base.forms import ApiForm
from base.forms.validators import DataRequired, DataLength
from database import db_session
from errors import unable_to_generate_token
from errors.http import BaseHTTPException
from rooms.models import Room


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class RoomForm(ApiForm):
    """Defines a form for the creation of a room."""

    model = Room
    name = StringField("name", [DataRequired(), DataLength(max=255)])

    def save(self):
        """
        Save the object defined by the form.

        :return: a new `Room` instance
        """
        obj = super().save()

        try:
            obj.owner_id = current_user.id
            obj.set_token(db_session)
        except IntegrityError:
            db_session.delete(obj)
            raise BaseHTTPException({"non_field_errors": unable_to_generate_token})
        except Exception:
            db_session.delete(obj)
            raise

        return obj
