"""This module contains utility base views."""

from abc import abstractmethod
from flask import jsonify
from flask import request
from flask.views import MethodView
from sqlalchemy.exc import InvalidRequestError

from base.forms import UniqueConstraintFail
from database import db_session
from errors import unique_constraint_failed
from errors.http import BadRequestException, NotFoundException
from runserver import app


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class ApiView(MethodView):
    """
    This view implements generic GET/POST/PUT/DELETE HTTP operations.

    It allows to easily implement a REST API view for a given model.
    """

    @property
    @abstractmethod
    def queryset(self):
        """Get the queryset on which the view works."""

    @property
    @abstractmethod
    def model(self):
        """Get the model represented in the view."""

    @abstractmethod
    def get_form(self):
        """Get the form used to validate the data."""

    def check_permissions(self, method):
        """
        Check that the user has the permissions to access this endpoint.

        :param method: http method treated
        """

    def check_object_permissions(self, obj, method):
        """
        Check that the user has the permission to access this object.

        :param obj: object for which to check permissions
        :param method: http method treated
        """

    def dispatch_request(self, _id=None, *args, **kwargs):
        """
        Check permissions, load object and redirect to the according method handler.

        :param _id: id of the object to load or None if no object has to be preloaded
        :param args: additional arguments
        :param kwargs: additional keyword arguments
        :return:  an HTTP response
        """
        method = getattr(self, request.method.lower(), None)
        self.check_permissions(method)

        if _id is not None:
            try:
                obj = self.queryset.filter(self.model.id == _id).one()
            except InvalidRequestError:
                raise NotFoundException()
            else:
                self.check_object_permissions(obj, method)
        else:
            obj = None

        return super().dispatch_request(obj, *args, **kwargs)

    def get(self, obj=None):
        """
        Get the given object or all objects.

        :param obj: object to return
        :return: an HTTP response
        """
        if obj is None:
            return jsonify(self.queryset.all())
        else:
            return jsonify(obj)

    def post(self, *args):
        """
        Create a new object.

        :param args: unused arguments
        :return: an HTTP response with the newly created object or a JSON explaining the errors.
        """
        form = self.get_form()
        if not form.validate_on_submit():
            raise BadRequestException(form.errors)

        try:
            obj = form.save()
        except UniqueConstraintFail as e:
            raise BadRequestException({e.field: unique_constraint_failed})
        else:
            return jsonify(obj)

    def delete(self, obj):
        """
        Delete the given object.

        :param obj: object to delete
        :return: an HTTP response
        """
        db_session.delete(obj)
        db_session.commit()
        return jsonify({})

    def put(self, obj):
        """
        Update the given object.

        :param obj: object to update with the information passed in the body
        :return: an HTTP response with the updated object
        """
        form = self.get_form()

        if not form.validate_on_submit():
            raise BadRequestException(form.errors)

        try:
            form.populate_obj(obj)
            db_session.commit()
        except UniqueConstraintFail as e:
            raise BadRequestException({e.field: unique_constraint_failed})
        else:
            return jsonify(obj)


def register_api(view, endpoint, url, pk_type="int"):
    """
    Register the given api endpoint.

    This will create two entries :
        One for GET and POST requests, allowing to list all objects and create new ones.
        One for GET, PUT and DELETE, allowing to get, update and delete individual objects.

    :param view: view to register
    :param endpoint: name of the endpoint to which to register the view
    :param url: url to which the view will be accessible
    :param pk_type: type of the primary key
    """
    view_func = view.as_view(endpoint)
    app.add_url_rule(url, view_func=view_func, methods=["GET", "POST"])
    app.add_url_rule(
        "{url}<{type}:_id>/".format(url=url, type=pk_type), view_func=view_func, methods=["GET", "PUT", "DELETE"]
    )
