from graphene import Field, Mutation, ObjectType, ResolveInfo

from todo_list.users.utils import login_required

from .types import (ToDoRecordCreationInput, ToDoRecordCreationPayload,
                    ToDoRecordStateToggleInput, ToDoRecordStateTogglePayload,
                    ToDoRecordUpdateInput, ToDoRecordUpdatePayload)
from .utils import (create_todo_record_in_db, toggle_todo_record_state_in_db,
                    update_todo_record_in_db, validate_user_email)


class ToDoRecordCreationMutation(Mutation):
    payload = Field(ToDoRecordCreationPayload, required=True)

    class Arguments:
        input = ToDoRecordCreationInput(required=True)

    @staticmethod
    def mutate(parent, info: ResolveInfo, input: ToDoRecordCreationInput):
        validate_user_email(input.user_email)
        todo_record = create_todo_record_in_db(
            content=input.content,
            user_email=input.user_email,
            user_name=input.user_name,
        )
        todo_record_id = todo_record['id']

        return ToDoRecordCreationMutation(
            payload=ToDoRecordCreationPayload(
                record=todo_record,
                id=todo_record_id,
            )
        )


class ToDoRecordStateToggleMutation(Mutation):
    payload = Field(ToDoRecordStateTogglePayload, required=True)

    class Arguments:
        input = ToDoRecordStateToggleInput(required=True)

    @staticmethod
    def mutate(parent, info: ResolveInfo, input: ToDoRecordStateToggleInput):
        todo_record_id = input.id
        todo_record = toggle_todo_record_state_in_db(todo_record_id)

        return ToDoRecordStateToggleMutation(
            payload=ToDoRecordStateTogglePayload(
                record=todo_record,
                id=todo_record_id,
            )
        )


class ToDoRecordUpdateMutation(Mutation):
    payload = Field(ToDoRecordUpdatePayload, required=True)

    class Arguments:
        input = ToDoRecordUpdateInput(required=True)

    @staticmethod
    @login_required
    def mutate(parent, info: ResolveInfo, input: ToDoRecordUpdateInput):
        todo_record_id = input.id
        todo_record = update_todo_record_in_db(
            record_id=todo_record_id,
            content=input.content,
            user_email=input.user_email,
            user_name=input.user_name,
        )

        return ToDoRecordUpdateMutation(
            payload=ToDoRecordUpdatePayload(
                record=todo_record,
                id=todo_record_id,
            )
        )


class ToDoRecordsRootMutation(ObjectType):
    create = ToDoRecordCreationMutation.Field()
    toggle_state = ToDoRecordStateToggleMutation.Field()
    update = ToDoRecordUpdateMutation.Field()
