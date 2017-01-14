"""This module defines custom types to be used with SQLAlchemy."""

from typing import Union

from sqlalchemy import TypeDecorator
from sqlalchemy import VARCHAR
from sqlalchemy.engine import Dialect
from sqlalchemy.sql.type_api import TypeEngine  # noqa

from crypto import SecureHash


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class Hash(TypeDecorator):
    """
    Defines a hash field.

    This class implements a field that is stored hashed, for example to store passwords.

    It transparently converts values given to a hash.
    """

    impl = VARCHAR  # type: TypeEngine

    def __init__(self, iterations: int, salt_length: int, **kwargs):
        """
        Create a new hash with the following parameters.

        :param iterations: number of iterations the hashing backend must do, if this is supported by the algorithm
        :param salt_length: size of the salt to add to the hash
        :param kwargs: additional arguments to pass to the parent
        """
        super().__init__(**kwargs)
        self.iterations = iterations
        self.salt_length = salt_length

    def convert(self, value: Union[SecureHash, str]) -> SecureHash:
        """
        Convert the given value to a `SecureHash`.

        If the value is already a `SecureHash`, returns it.
        If the value is a string, hashes it and returns a new `SecureHash` instance.
        Otherwise, will throw a `TypeError` as we don't support converting from another type than `str`.

        :param value: value to convert to a `SecureHash`
        :return: a new `SecureHash` for the given value
        """
        if isinstance(value, SecureHash):
            return value
        elif isinstance(value, str):
            return SecureHash.hash(value, iterations=self.iterations, salt_length=self.salt_length)
        elif value is not None:
            raise TypeError("Cannot convert {} to a PasswordHash".format(type(value)))

    def process_bind_param(self, value: Union[SecureHash, str], dialect: Dialect) -> str:
        """
        Check that the value is a valid `PasswordHash` and returns its hash.

        :param value: the value for which to get the hashed value.
        :param dialect: the `Dialect` in use
        :return: the hashed value
        """
        return self.convert(value).value

    def process_result_value(self, value: Union[SecureHash, str], dialect: Dialect) -> SecureHash:
        """
        If the value is not None, converts it to a `SecureHash`.

        :param value: value to convert to a hash
        :param dialect: the `Dialect` in use
        :return: a new SecureHash for the given value
        """
        if value is not None:
            return SecureHash(value, iterations=self.iterations, salt_length=self.salt_length)
