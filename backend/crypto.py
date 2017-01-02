"""This module contains all crypto-related utilities for our application."""


from typing import Union

import base64
import hmac
import random
import string

from hashlib import pbkdf2_hmac
from sqlalchemy.ext.mutable import Mutable


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


class HashValidationError(Exception):
    """This exception is thrown when a hash is malformed."""

    def __init__(self, msg: str):
        """
        Create a new `HashValidationError`.

        :param msg: message to explain what went wrong
        """
        self.msg = msg


class SecureHash(Mutable):
    """
    Define a Mutable Hash.

    This provides utilities to securely store and compare passwords or other values that need to be hashed.

    This class supports changing the number of iterations or the length of the salt transparently and the update to
    existing hashes will be done the first time a value is compared successfully to the hash.
    """

    iterations = 30000  # type: int
    salt_length = 12  # type: int

    def __init__(self, value: str=None, iterations: int=None, salt_length: int=None):
        """
        Create a new Hash with the given parameters.

        If `value` is not None, then it must be an already hashed value. To create a hash of a new value, please use
        the `SecureHash.hash`.

        :param value: current hash value
        :param iterations: number of iterations to make with the hashing algorithm if it supports it
        :param salt_length: length of the salt to use
        """
        self.hasher = PBKDF2Sha256Hasher(iterations or self.iterations, salt_length or self.salt_length)

        if value is not None and value.count("$") != 3:
            raise HashValidationError("This is not a valid hash: {}".format(value))

        self.value = value

    def __eq__(self, value: Union[str, "SecureHash"]):
        """
        Check whether the given value is equal to the current hash or not.

        If the value is a string, this will hash it with the same salt and algorithm than the current hash and will
        check both values for equality. If they match, then will also check if the current hash needs a re-hash and
        will rehash it accordingly.

        If the value is a `SecureHash` will simply check both hash values.

        :param value: value to compare with
        :return: True if the value is the same as the hash
        """
        if isinstance(value, str):
            if self.hasher.verify(value, self.value):
                if self.hasher.needs_rehash(self.value):
                    self.value = self.hasher.rehash(value, self.value)
                    self.changed()
                return True
        elif isinstance(value, SecureHash):
            return hmac.compare_digest(self.value, value.value)
        return False

    @classmethod
    def hash(cls, value: str, iterations: int=None, salt_length: int=12):
        """
        Create a new `SecureHash` from the given value.

        :param value: value to hash
        :param iterations: number of iterations to make if the hashing algorithm supports iterations
        :param salt_length: length of the salt to use
        :return: a new `SecureHash` instance encapsulating the hash
        """
        new_hash = cls(iterations=iterations, salt_length=salt_length)
        new_hash.value = new_hash.hasher.hash(value)
        return new_hash


class PBKDF2Sha256Hasher:
    """
    This is a hashing class to be used with `SecureHash` instances.

    This class uses pbkdf2 with a sha256 hashing function.
    """

    # name of the algorithm to embed in the hashed value
    algorithm = "pbkdf2_sha256"  # type: str

    # name of the digest to use with PBKDF2
    digest = "sha256"

    def __init__(self, iterations: int, salt_length: int):
        """
        Create a new hasher.

        :param iterations: number of iterations to make when hashing a value
        :param salt_length: length of the salt to use
        """
        self.iterations = iterations
        self.salt_length = salt_length

    def hash(self, value: str, salt: str=None, iterations: int=None):
        """
        Hash the given value.

        If `salt` is None, this will generate a new hash of length `self.salt_length`.
        If `iterations` is None, this will use `self.iterations` instead.

        :param value: value for which to get the hash
        :param salt: salt to use when hashing the value
        :param iterations: number of iterations to make
        :return: the new hashed value
        """
        if iterations is None:
            iterations = self.iterations

        if salt is None:
            salt = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(self.salt_length))

        _hash = pbkdf2_hmac("sha256", value.encode("utf8"), salt.encode("utf8"), int(iterations))
        _hash = base64.b64encode(_hash).decode('ascii').strip()
        return "{algorithm}${iterations}${salt}${hash}".format(
            algorithm=self.algorithm, iterations=iterations, salt=salt, hash=_hash
        )

    def verify(self, value: str, encoded: str):
        """
        Check that the given value corresponds to the `encoded` hash.

        This uses secure constant-time comparisons to prevent timing attacks.

        :param value: value to check against the hash
        :param encoded: hash for which to check
        :return: True if the value corresponds to the hash
        """
        algorithm, iterations, salt, _ = encoded.split('$', 3)

        if algorithm != self.algorithm:
            raise HashValidationError("The algorithm used when hashing the hash is not the same as current algorithm.")

        password_to_verify = self.hash(value, salt, iterations)
        return hmac.compare_digest(encoded, password_to_verify)

    def needs_rehash(self, encoded: str):
        """
        Check whether the given hash is outdated and needs rehashing.

        :param encoded: hash to check
        :return: True if the current hash is out of date
        """
        iterations, salt = encoded.split('$', 3)[1:3]
        return int(iterations) != self.iterations or len(salt) != self.salt_length

    def rehash(self, original, encoded):
        """
        Rehash the original value, to update the encoded hash.

        :param original: original value of the hash
        :param encoded: the old encoded version
        :return: a newly hashed value to replace the old one
        """
        iterations, salt = encoded.split('$', 3)[1:2]
        if len(salt) != self.salt_length:
            salt = None
        return self.hash(original, salt, self.iterations)
