"""Defines forms related to authentication usage."""

from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.fields.html5 import EmailField
from wtforms.validators import DataRequired

from base.forms.validators import DataLength

__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class LoginForm(FlaskForm):
    """Defines a form for user credentials."""

    username = StringField("username", [DataRequired(), DataLength(max=255)])
    password = PasswordField("password", [DataRequired()])


class RegisterForm(LoginForm):
    """Defines a form used for users' accounts."""

    email = EmailField("username", [DataRequired(), EmailField(), DataLength(max=255)])
