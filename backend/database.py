"""This module contains database-related utilities for the application."""

import os
from blinker import Namespace
from flask import _app_ctx_stack
from sqlalchemy import create_engine
from sqlalchemy import event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


def get_database_information():
    """Prepare the database connection string."""
    _engine = os.environ.get("DATABASE_ENGINE", None)
    user = os.environ.get("DATABASE_USER", None)
    password = os.environ.get("DATABASE_PASSWORD", None)
    host = os.environ.get("DATABASE_HOST", None)
    name = os.environ.get("DATABASE_NAME", None)

    if _engine is None:
        print("Could not determine engine to use. Please set DATABASE_ENGINE environment variable.")
        exit(1)

    if name is None:
        print("Could not determine database name to use. Please set DATABASE_NAME environment variable.")
        exit(1)

    if host is None:
        print("Could not determine database host to use. Please set DATABASE_HOST environment variable.")
        exit(1)

    if _engine.startswith("sqlite"):
        print("SQLite is not supported as it misses support for CASCADE operations.")

    connection_string = _engine + "://"

    if user is not None:
        connection_string += user

        if password is not None:
            connection_string += ":" + password

        connection_string += "@"

    connection_string += host + "/" + name
    return connection_string


class Signals:
    """Defines signals that are thrown on database changes."""

    _namespace = Namespace()

    changed = _namespace.signal("changed")
    deleted = _namespace.signal("deleted")
    new = _namespace.signal("new")


engine = create_engine(get_database_information(), convert_unicode=True)
db_session = scoped_session(sessionmaker(autoflush=False, bind=engine), scopefunc=_app_ctx_stack)

Base = declarative_base()
Base.query = db_session.query_property()

DBSignals = Signals()


@event.listens_for(db_session, "before_commit")
def save_changes_to_be_committed(session):
    """
    Save changes that are going to be committed to the session.

    :param session: session that is going to be committed
    """
    session.changes_committed = {
        "deleted": session.deleted,
        "dirty": session.dirty,
        "new": session.new
    }


@event.listens_for(db_session, "after_commit")
def notify_changes(session):
    """
    Notify of all changes that where done by the session.

    :param session: session for which to notify changes
    """
    for o in session.changes_committed["deleted"]:
        DBSignals.deleted.send(o.__class__, object=o)

    for o in session.changes_committed["dirty"]:
        DBSignals.changed.send(o.__class__, object=o)

    for o in session.changes_committed["new"]:
        DBSignals.new.send(o.__class__, object=o)
