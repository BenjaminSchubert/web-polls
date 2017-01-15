"""Here we override all used validators from WTForms to get our custom error messages."""

from wtforms import validators

import errors


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class DataRequired(validators.DataRequired):
    """This validates that the data is not None."""

    def __init__(self):
        """Create a new DataRequired validator."""
        self.message = errors.required
