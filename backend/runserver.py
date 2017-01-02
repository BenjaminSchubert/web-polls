#!/usr/bin/env python3

"""
Main entry point for the webpoll application.

This script configures and launches the server.
"""

from flask import Flask
from flask_login import LoginManager
from flask_wtf import CsrfProtect

from database import init_db, db_session
from json import CustomJSONEncoder
from models import User


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"

app = Flask("webpolls")
app.config["SECRET_KEY"] = "very secret"  # FIXME: we need to externalize this

login_manager = LoginManager()
csrf = CsrfProtect()
# this is to simplify Angular2 configuration
app.config.setdefault('WTF_CSRF_HEADERS', ['X-XSRF-TOKEN'])

app.json_encoder = CustomJSONEncoder

init_db()


@app.teardown_appcontext
def close_session(exception=None):
    """
    Close the database connection.

    :param exception: whether an exception was thrown or not during the request
    """
    db_session.remove()


csrf.init_app(app)
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    """
    Get the user with the given id.

    :param user_id: id of the user to get
    :return: a `User` instance corresponding to the id
    """
    return User.query.filter(User.id == user_id).first()


from views import *  # noqa


if __name__ == "__main__":
    app.run(threaded=True, debug=True)  # FIXME: a configuration file would be much better
