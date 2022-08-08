from typing import Any

from graphene import Field, ObjectType, ResolveInfo
from graphene.relay import Node

from todo_list.exceptions import APIException

from ..models import ToDoRecord
from .connection import (GQLParamValidationException, create_connection,
                         validate_connection_params)
from .types import (ToDoRecordConnection, ToDoRecordConnectionParamsType,
                    ToDoRecordNode)
from .utils import get_todo_records_from_db


class ToDoRecordListQuery(ObjectType):
    todo_record_list = Field(
        ToDoRecordConnection,
        params=ToDoRecordConnectionParamsType(required=True),
        required=True
    )

    @staticmethod
    def resolve_todo_record_list(
        parent: Any, info: ResolveInfo, params: ToDoRecordConnectionParamsType
    ) -> ToDoRecordConnection:
        available_ordering_fields = ToDoRecord.available_ordering_fields
        try:
            connection_params = validate_connection_params(
                params=params,
                node_type=ToDoRecordNode,
                available_ordering_fields=available_ordering_fields,
            )
        except GQLParamValidationException as err:
            raise APIException(err)
        todo_records = get_todo_records_from_db(params=connection_params)
        connection = create_connection(
            record_list=todo_records,
            params=connection_params,
            connection_type=ToDoRecordConnection,
            node_type=ToDoRecordNode,
        )

        return connection


class ToDoRecordsRootQuery(
    ToDoRecordListQuery,
):
    node = Node.Field()
