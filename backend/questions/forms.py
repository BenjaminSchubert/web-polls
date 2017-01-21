"""Defines forms related to questions."""
from sqlalchemy.exc import IntegrityError
from wtforms import FormField
from wtforms import StringField, TextAreaField, SelectField, BooleanField, IntegerField, FieldList

from base.forms import ApiForm
from base.forms.validators import DataRequired
from database import db_session
from questions import Question, QuestionType, Choice


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class ChoiceForm(ApiForm):
    text = StringField("text", [DataRequired()])


class QuestionForm(ApiForm):
    """Defines a form for the creation of a question."""

    model = Question
    choices = FieldList(FormField(ChoiceForm), min_entries=2)
    title = StringField("name", [DataRequired()])
    description = TextAreaField("description")
    poll_id = IntegerField("poll_id", [DataRequired()])

    type = SelectField("type", choices=[
        (QuestionType.MULTIPLE.value, QuestionType.MULTIPLE.value),
        (QuestionType.UNIQUE.value, QuestionType.UNIQUE.value),
    ])

    visible = BooleanField("visible")

    def save(self):
        """Save the current form data an a new object."""
        question = self.model()

        for name, field in self._fields.items():
            if name != "choices":
                field.populate_obj(question, name)

        db_session.add(question)

        for choice_field in self._fields["choices"]:
            choice = Choice()
            choice_field.form.populate_obj(choice)
            question.choices.append(choice)

        try:
            db_session.commit()
        except IntegrityError as e:
            self.check_integrity_error(e)

        return question
