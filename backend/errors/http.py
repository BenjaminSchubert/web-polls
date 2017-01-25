"""
This module contains a collection of commonly encountered HTTP exceptions.

This allows all these http exceptions to be treated in the same way and simplifies the return of errors to the user.
"""

from errors import ErrorMessage


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class BaseHTTPException(Exception):
    """
    This is the base HTTP Exception.

    It should not be used as is, as it signifies that the server had an unexpected error.
    """

    status_code = 500  # type: int

    def __init__(self, payload: ErrorMessage = None, status_code: int = None):
        """
        Create a new `BaseHTTPException`.

        :param payload: payload to send to explain the error to the user.
        :param status_code: HTTP status code to send. If not given, will fallback to `self.status_code`.
        """
        super().__init__(self)
        if payload is None:
            payload = dict()
        self.payload = payload

        if status_code is not None:
            self.status_code = status_code


class ForbiddenException(BaseHTTPException):
    def __init__(self):
        super().__init__({}, 401)


class BadRequestException(BaseHTTPException):
    """This is an exception to throw to return a 400 BAD REQUEST to the user."""

    def __init__(self, payload: ErrorMessage):
        """
        Create a new `BadRequestException`.

        :param payload: payload to send to explain the error to the user.
        """
        super().__init__(payload, 400)


class NotFoundException(BaseHTTPException):
    """This is an exception to throw to return a 404 NOT FOUND to the user."""

    def __init__(self):
        """Create a new `NotFoundException`."""
        super().__init__(None, 404)
