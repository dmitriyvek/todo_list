from typing import Any

from graphene import Field, ObjectType, ResolveInfo

from .todo_records.graphql_resources import ToDoRecordsRootMutation
from .users.graphql_resources import UsersRootMutation


class Mutation(ObjectType):
    todos = Field(ToDoRecordsRootMutation, required=True)
    users = Field(UsersRootMutation, required=True)

    @staticmethod
    def resolve_todos(parent: Any, info: ResolveInfo):
        return {}

    @staticmethod
    def resolve_users(parent: Any, info: ResolveInfo):
        return {}
