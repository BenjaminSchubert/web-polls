"""Defines all views related to rooms."""

from flask import jsonify
from flask.views import MethodView
from flask_login import current_user, login_required
from flask_socketio import Namespace, emit, join_room
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import NoResultFound

from errors import unique_constraint_failed, unable_to_generate_token, invalid_room_token
from forms.rooms import RoomCreationForm
from models import Room
from models import User
from runserver import app, db_session, socketio


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class RoomApiView(MethodView):
    """Defines views related to rooms."""

    def get(self):
        """Get the list of all rooms."""
        return jsonify(Room.query.join(Room.participants).filter(User.rooms.any(User.id == current_user.id)).all())

    def post(self):
        """Create a new room."""
        form = RoomCreationForm()

        if form.validate_on_submit():
            room = Room(owner=current_user)
            form.populate_obj(room)
            room.participants.append(current_user)

            try:
                db_session.commit()
            except IntegrityError as e:
                origin = str(e.orig).lower()
                if "unique" in origin:
                    # this is very likely a unique constraint fail
                    field = origin.split(":")[-1].split(".")[-1]
                    return jsonify({field: unique_constraint_failed}), 400

            try:
                room.set_token(db_session)
            except IntegrityError:
                db_session.delete(room)
                return jsonify({"non_field_errors": unable_to_generate_token}), 500

            return jsonify(room)

        return jsonify(form.errors), 400


app.add_url_rule("/rooms/", view_func=login_required(RoomApiView.as_view("rooms")))


class RoomNamespace(Namespace):
    """Defines Socket.IO operations for rooms."""

    def on_connect(self):
        """Check that the user is authenticated and registers him to its rooms."""
        if not current_user.is_authenticated:
            return

        rooms = Room.query.join(Room.participants).filter(User.rooms.any(User.id == current_user.id)).all()

        for room in rooms:
            join_room(room.id)
        emit("list", rooms)

    def on_join(self, token):
        """
        Make the user join the room identified by the given token.

        :param token: token of the room
        """
        try:
            room = Room.query.filter(Room.token == token).join(Room.participants).one()
        except NoResultFound:
            return {"code": invalid_room_token}

        if current_user.is_authenticated:
            if current_user not in room.participants:
                room.participants.append(current_user)
                db_session.commit()

        join_room(room.id)
        emit("item", room)


socketio.on_namespace(RoomNamespace("/rooms"))
