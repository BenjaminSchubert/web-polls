"""This module contains database-related utilities for the application."""


from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


engine = create_engine('sqlite:///../test.db', convert_unicode=True)  # FIXME : allow database configuration
db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

Base = declarative_base()
Base.query = db_session.query_property()


def init_db():
    """Initialize the database."""
    import models  # noqa
    Base.metadata.create_all(bind=engine)
