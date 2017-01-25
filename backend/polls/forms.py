"""Defines forms related to polls."""

from wtforms import StringField, TextAreaField, SelectField, BooleanField, IntegerField

from base.forms import ApiForm
from base.forms.validators import DataRequired, DataLength
from polls import Poll, PollType


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class PollForm(ApiForm):
    """Defines a form for the creation of a poll."""

    model = Poll
    name = StringField("name", [DataRequired(), DataLength(max=255)])
    description = TextAreaField("description")
    room_id = IntegerField("room_id", [DataRequired()])
    type = SelectField("type", choices=[(PollType.MANUAL.name, PollType.MANUAL.value)])
    visible = BooleanField("visible")
