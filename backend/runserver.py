#!/usr/bin/env python3

"""
Main entry point for the webpolls application.

This script configures and launches the server.
"""

import sys
from time import sleep

import flask
from flask import Flask
from flask_login import LoginManager
from flask_socketio import SocketIO
from flask_wtf import CSRFProtect
from sqlalchemy.exc import OperationalError

from base.json import CustomJSONEncoder
from database import engine


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"

app = Flask("webpolls")
app.config["SECRET_KEY"] = "very secret"  # FIXME: we need to externalize this

# this is to simplify Angular2 configuration
app.config.setdefault('WTF_CSRF_HEADERS', ['X-XSRF-TOKEN'])

login_manager = LoginManager(app)
csrf = CSRFProtect(app)
socketio = SocketIO(app, json=flask.json)

app.json_encoder = CustomJSONEncoder

# noinspection PyUnresolvedReferences
from database import Base, db_session
# noinspection PyUnresolvedReferences
from authentication import User
# noinspection PyUnresolvedReferences
from errors.handlers import *  # noqa
# noinspection PyUnresolvedReferences
from authentication import *  # noqa
# noinspection PyUnresolvedReferences
from polls import *  # noqa
# noinspection PyUnresolvedReferences
from rooms import *  # noqa


@app.teardown_appcontext
def close_session(exception=None):
    """
    Close the database connection.

    :param exception: whether an exception was thrown or not during the request
    """
    db_session.remove()


@login_manager.user_loader
def load_user(user_id):
    """
    Get the user with the given id.

    :param user_id: id of the user to get
    :return: a `User` instance corresponding to the id
    """
    return User.query.filter(User.id == user_id).one()


retries = 10
for i in range(retries):
    try:
        Base.metadata.create_all(bind=engine)
    except OperationalError as e:
        if "Connection refused" in e.args[0]:
            print("[{}/{}] It seems like the database is not yet up. waiting 10 seconds before retrying".format(
                i, retries
            ), file=sys.stderr)
            sleep(10)
            continue

        print("Could not setup tables, got", "; ".join(e.args))
        exit(1)
    else:
        break

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", debug=True)  # FIXME: a configuration file would be much better
