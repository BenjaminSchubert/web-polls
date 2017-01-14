"""Defines all authentication-related views for our application."""

from flask import jsonify
from flask import request
from flask_login import login_user, login_required, logout_user, current_user
from sqlalchemy.exc import IntegrityError

from authentication.forms import RegisterForm, LoginForm
from authentication.models import User
from database import db_session
from errors import bad_credentials, unique_constraint_failed
from runserver import app


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


@app.route("/login/", methods=["POST"])
def login():
    """Login a user."""
    form = LoginForm()
    if form.validate_on_submit():
        user = db_session.query(User).filter_by(username=form.username.data).first()

        if user is None or user.password != form.password.data:
            user = db_session.query(User).filter_by(email=form.username.data).first()

            if user is None or user.password != form.password.data:
                return jsonify({"non_field_errors": bad_credentials}), 401

        login_user(user)

        return jsonify({})

    return jsonify(form.errors), 400


@app.route("/logout/", methods=["POST"])
@login_required
def logout():
    """Logout current user."""
    logout_user()
    return jsonify({})


@app.route("/register/", methods=["POST"])
def register():
    """Register a new user."""
    form = RegisterForm()

    if form.validate_on_submit():
        user = User()
        form.populate_obj(user)
        db_session.add(user)

        try:
            db_session.commit()
        except IntegrityError as e:
            origin = str(e.orig).lower()
            if "unique" in origin:
                # this is very likely a unique constraint fail
                field = origin.split(":")[-1].split(".")[-1]
                return jsonify({field: unique_constraint_failed}), 400

        login_user(user)

        return jsonify({})

    return jsonify(form.errors), 400


@app.route("/account/", methods=["GET", "POST"])  # TODO: implement POST
@login_required
def account():
    """Allow a user to get or modify his profile."""
    if request.method == "GET":
        return jsonify(current_user)
