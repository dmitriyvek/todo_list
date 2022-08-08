from typing import Any

from graphene import Field, ObjectType, ResolveInfo

from .todo_records.graphql_resources import ToDoRecordsRootQuery


class Query(ObjectType):
    todo_records = Field(ToDoRecordsRootQuery, required=True)

    @staticmethod
    def resolve_todo_records(parent: Any, info: ResolveInfo):
        return {}
