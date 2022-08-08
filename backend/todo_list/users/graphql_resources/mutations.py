from typing import Any

from flask import request
from graphene import Field, Mutation, ObjectType, ResolveInfo

from todo_list.db_engine import db

from ..utils import (blacklist_token, generate_auth_token, login_required,
                     validate_credentials)
from .types import LoginInput, LoginPayload, LogoutPayload, ResponseStatus


class LoginMutation(Mutation):
    payload = Field(LoginPayload, required=True)

    class Arguments:
        input = LoginInput(required=True)

    @staticmethod
    def mutate(parent: Any, info: ResolveInfo, input: LoginInput):
        user_id = validate_credentials(
            username=input.username,
            password=input.password,
        )
        auth_token = generate_auth_token(user_id=user_id)

        return LoginMutation(
            payload=LoginPayload(
                auth_token=auth_token,
                status=ResponseStatus.SUCCESS,
            )
        )


class LogoutMutation(Mutation):
    payload = Field(LogoutPayload, required=True)

    @staticmethod
    @login_required
    def mutate(parent: Any, info: ResolveInfo):
        auth_token = request.auth_token
        blacklist_token(db=db, token=auth_token)

        return LogoutMutation(
            payload=LogoutPayload(
                status=ResponseStatus.SUCCESS
            )
        )


class UsersRootMutation(ObjectType):
    login = LoginMutation.Field()
    logout = LogoutMutation.Field()
