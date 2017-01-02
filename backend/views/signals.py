"""This module contains functions that must be called when the flask application sends various signals."""

from flask import Response
from flask import request
from flask_wtf.csrf import generate_csrf

from runserver import app


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


@app.after_request
def set_csrf_cookie(response: Response):
    """
    Set the csrf cookie if it's not yet set before sending the response back to the user.

    :param response: response to send back
    :return: the response with its token attached
    """
    if request.cookies.get("XSRF-TOKEN") is None:
        response.set_cookie("XSRF-TOKEN", generate_csrf())
    return response
