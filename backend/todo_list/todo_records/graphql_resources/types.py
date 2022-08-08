from graphene import (Boolean, Connection, Field, InputObjectType, Int,
                      ObjectType, ResolveInfo, String)
from graphene.relay import Node

from ..models import ToDoRecord
from .connection import BaseConnectionParamsType
from .utils import get_todo_record_by_id, get_todo_record_quantity


class ToDoRecordConnectionParamsType(BaseConnectionParamsType):
    ordering_field = String(
        description='The name of the field to sort by. The rest of the params apply to it.',
        default_value=ToDoRecord.default_ordering_field,
    )


class ToDoRecordNode(ObjectType):
    record_id = Int()
    content = String()
    user_name = String()
    user_email = String()
    is_done = Boolean()
    is_edited_by_admin = Boolean()

    class Meta:
        interfaces = (Node, )

    @classmethod
    def get_node(cls, info: ResolveInfo, record_id: int):
        todo_record = get_todo_record_by_id(record_id=record_id)
        return ToDoRecordNode(**todo_record)

    @staticmethod
    def resolve_record_id(parent, info: ResolveInfo) -> int:
        return parent['id']


class ToDoRecordConnection(Connection):
    total_count = Int(required=True)

    class Meta:
        node = ToDoRecordNode

    @staticmethod
    def resolve_total_count(parent, info: ResolveInfo) -> int:
        total_count = get_todo_record_quantity()
        return total_count


class BaseToDoRecordInput(InputObjectType):
    content = String(required=True)
    user_name = String(required=True)
    user_email = String(required=True)


class BaseToDoRecordPayload(ObjectType):
    record = Field(ToDoRecordNode, required=True)
    id = Int(required=True)


class ToDoRecordCreationInput(BaseToDoRecordInput):
    pass


class ToDoRecordCreationPayload(BaseToDoRecordPayload):
    pass


class ToDoRecordStateToggleInput(InputObjectType):
    id = Int(required=True)


class ToDoRecordStateTogglePayload(BaseToDoRecordPayload):
    pass


class ToDoRecordUpdateInput(BaseToDoRecordInput):
    id = Int(required=True)


class ToDoRecordUpdatePayload(BaseToDoRecordPayload):
    pass
