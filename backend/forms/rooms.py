"""Defines forms related to rooms."""

from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class RoomCreationForm(FlaskForm):
    """Defines a form for the creation of a room."""

    name = StringField("name", [DataRequired()])
