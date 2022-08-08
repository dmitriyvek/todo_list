from dataclasses import asdict, dataclass
from datetime import datetime, timedelta
from functools import wraps
from types import FunctionType
from typing import Any, TypeVar

import jwt
from flask import Request, current_app, request
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash

from todo_list.exceptions import APIException

from .models import BlacklistedToken, User

USER_ID = TypeVar('USER_ID', bound=int)
AUTH_TOKEN = TypeVar('AUTH_TOKEN', bound=str)


@dataclass
class AuthTokenPayload:
    sub: USER_ID
    exp: datetime
    iat: datetime


def validate_credentials(username: str, password: str) -> USER_ID:
    error_message = 'User with given credentials does not exist.'
    user = User.query.\
        filter_by(username=username).\
        first()
    if not user:
        raise APIException(error_message)

    password_is_valid = check_password_hash(
        user.password,
        password,
    )
    if not password_is_valid:
        raise APIException(error_message)

    user_id = user.id
    return user_id


def generate_auth_token(user_id: USER_ID) -> AUTH_TOKEN:
    secrete_key = current_app.config.SECRET_KEY
    expiration_timeout = current_app.config.TOKEN_EXPIRATION_TIMEOUT
    expiration_timeout_timestamp = timedelta(seconds=expiration_timeout)
    creation_timestamp = datetime.utcnow()
    token_expiration_timestamp = creation_timestamp + expiration_timeout_timestamp
    payload = AuthTokenPayload(
        sub=user_id,
        iat=creation_timestamp,
        exp=token_expiration_timestamp
    )

    token = jwt.encode(
        asdict(payload),
        secrete_key,
        algorithm='HS256',
    )
    return token


def get_user_id_from_token(token: AUTH_TOKEN) -> USER_ID:
    token_payload = decode_token(token)
    user_id = token_payload.sub
    return user_id


def decode_token(token: AUTH_TOKEN) -> AuthTokenPayload:
    try:
        secret_key = current_app.config.SECRET_KEY
        payload = jwt.decode(
            token,
            secret_key,
            algorithms=['HS256'],
        )
        check_if_token_is_blacklisted(token)
        payload = AuthTokenPayload(**payload)
        return payload

    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        error_message = 'Authentication is required.'
        raise APIException(error_message)


def check_if_token_is_blacklisted(token: AUTH_TOKEN) -> None:
    token_is_blacklisted = BlacklistedToken.query.\
        filter_by(token=token).\
        first()
    if token_is_blacklisted:
        error_message = 'Authentication is required.'
        raise APIException(error_message)


def get_auth_token_from_request(request: Request) -> AUTH_TOKEN:
    headers = request.headers
    auth_header = headers.get('Authorization')
    if not auth_header:
        error_message = 'Authorization header is not provided.'
        raise APIException(error_message)
    try:
        auth_token = get_token_from_auth_header(auth_header)
    except Exception:
        error_message = 'Authorization header token is invalid.'
        raise APIException(error_message)

    return auth_token


def get_token_from_auth_header(auth_header: str) -> AUTH_TOKEN:
    auth_token = auth_header.split(' ')[1]
    return auth_token


def blacklist_token(db: SQLAlchemy, token: AUTH_TOKEN) -> None:
    blacklisted_token = BlacklistedToken(token=token)
    db.session.add(blacklisted_token)
    db.session.commit()


def login_required(func: FunctionType) -> FunctionType:

    @wraps(func)
    def wrapped_func(*args, **kwargs) -> Any:
        auth_token = get_auth_token_from_request(request=request)
        user_id = get_user_id_from_token(token=auth_token)
        request.user_id = user_id
        request.auth_token = auth_token
        return func(*args, **kwargs)

    return wrapped_func
