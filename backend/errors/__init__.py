"""
Defines errors and error messages that can be found across the application.

When a view has to return an error, it should define a new error message here and return it.

This is to be sure we have unique error codes for every error that can be sent.
"""

import typing


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


ErrorMessage = typing.NamedTuple("Error", [("message", str), ("code", int)])

already_logged_in = ErrorMessage(message="User is already logged in.", code=1)
csrf_missing = ErrorMessage(message="CSRF token is missing.", code=2)
bad_credentials = ErrorMessage(message="Username or password not recognized.", code=3)
unauthorized = ErrorMessage(message="Unauthorized, please login.", code=4)
unique_constraint_failed = ErrorMessage(message="This field must be unique", code=5)
