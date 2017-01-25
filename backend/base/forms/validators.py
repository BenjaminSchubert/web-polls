"""Here we override all used validators from WTForms to get our custom error messages."""
from wtforms import ValidationError
from wtforms import validators

import errors


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class DataRequired(validators.DataRequired):
    """This validates that the data is not None."""

    def __init__(self):
        """Create a new DataRequired validator."""
        self.message = errors.required


class DataLength(validators.Length):
    def __init__(self, min=-1, max=-1):
        super().__init__(min=min, max=max)
        self.message = errors.too_long

    def __call__(self, form, field):
        try:
            super().__call__(form, field)
        except TypeError:
            raise ValidationError(self.message)
