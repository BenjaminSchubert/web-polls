"""This module contains json-related utilities."""

from typing import Any

from flask.json import JSONEncoder
from sqlalchemy.orm import object_mapper
from sqlalchemy.orm.exc import UnmappedInstanceError

from models.mixins import SerializableMixin


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class CustomJSONEncoder(JSONEncoder):
    """Extends `JSONEncoder` to support automatic serialization of objects that extends `SerializableMixin`."""

    @staticmethod
    def implements_serializable(obj: Any) -> bool:
        """
        Check whether the given object extends `SerializableMixin`.

        :param obj: the object for which to check
        :return: True if the object extends `SerializableMixin`
        """
        try:
            if issubclass(object_mapper(obj).class_, SerializableMixin):
                return True
        except UnmappedInstanceError:
            return False
        return False

    def default(self, obj: Any):
        """
        Serialize the given object.

        :param obj: object to serialize
        :return: the serialized object
        """
        if self.implements_serializable(obj):
            return obj.as_dict()
        return super().default(obj)
