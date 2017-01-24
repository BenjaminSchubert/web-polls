"""
This module defines all error handlers for our application.

These error handlers take care of sending a meaningful message to the user.
"""

from flask import abort
from flask import jsonify
from flask_wtf.csrf import CSRFError

import errors
from errors import csrf_missing
from errors.http import BaseHTTPException
from runserver import app, login_manager


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


@app.errorhandler(BaseHTTPException)
def handle_invalid_usage(error):
    """
    Format the response to send to the user in case of HTTP Exception.

    :param error: error message containing the payload and status code of the error.
    """
    return jsonify(error.payload), error.status_code


@app.errorhandler(CSRFError)
def csrf_error(error):
    """
    Notify the user that the csrf token is missing for his form submission.

    :param error: reason of why the token is missing, unused
    """
    return jsonify(csrf_missing), 400


@login_manager.unauthorized_handler
def unauthorized():
    """Notify the user that he doesn't have the right to access the current resource and must login first."""
    return jsonify(errors.unauthorized), 401
