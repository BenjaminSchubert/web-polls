"""This module contains mixins for models."""


from typing import Dict, Sequence  # noqa


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class SerializableMixin:
    """
    This mixin allows a SQLAlchemy model to be serialized generically.

    It will check for every column defined in the SQLAlchemy model and extract the value for it.

    To prevent some fields from being added to the result, add them to the `__excluded__` attribute of the model.
    """

    __excluded__ = set()  # type: Sequence[str]

    def as_dict(self) -> Dict:
        """Serialize the model to a dictionary."""
        return {c.name: getattr(self, c.name) for c in self.__table__.columns if c.name not in self.__excluded__}
