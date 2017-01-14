"""This module contains database-related utilities for the application."""

from blinker import Namespace
from flask import _app_ctx_stack
from sqlalchemy import create_engine
from sqlalchemy import event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class Signals:
    """Defines signals that are thrown on database changes."""

    namespace = Namespace()
    deleted = namespace.signal("deleted")


engine = create_engine('sqlite:///../test.db', convert_unicode=True)  # FIXME : allow database configuration
db_session = scoped_session(sessionmaker(autoflush=False, bind=engine), scopefunc=_app_ctx_stack)

Base = declarative_base()
Base.query = db_session.query_property()

DBSignals = Signals()


@event.listens_for(db_session, "deleted_to_detached")
def disconnect_deleted_room(session, instance):
    """
    Notify that an object is totally destroyed.

    :param session: session in which the change occurred
    :param instance: the destroy object
    """
    DBSignals.deleted.send(instance.__class__, id=instance.id)
