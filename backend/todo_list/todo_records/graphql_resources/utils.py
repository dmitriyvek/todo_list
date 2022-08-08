from re import compile, fullmatch
from typing import Dict, List

from todo_list.db_engine import db
from todo_list.exceptions import APIException

from ..models import ToDoRecord
from .connection import modify_query_by_connection_params


def get_todo_record_by_id(record_id: int) -> Dict:
    todo_record = ToDoRecord.query.get(record_id)
    todo_dict_record = todo_record.as_dict()
    return todo_dict_record


def get_todo_record_quantity() -> int:
    quantity = ToDoRecord.query.count()
    return quantity


def get_todo_records_from_db(params) -> List[Dict]:
    query = db.session.query(ToDoRecord)
    query = modify_query_by_connection_params(query, params, ToDoRecord)
    records = query.all()
    formatted_records = format_todo_record_list(records)
    return formatted_records


def format_todo_record_list(todo_records: List[ToDoRecord]) -> List[Dict]:
    records = list(map(lambda record: record.as_dict(), todo_records))
    return records


def validate_user_email(email: str) -> None:
    email_regex = compile(r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+')
    email_is_valid = fullmatch(email_regex, email)
    if not email_is_valid:
        error_message = 'Email is invalid.'
        raise APIException(error_message)


def create_todo_record_in_db(
    content: str,
    user_name: str,
    user_email: str,
) -> Dict:
    todo_record = ToDoRecord(
        content=content,
        user_name=user_name,
        user_email=user_email,
    )
    db.session.add(todo_record)
    db.session.commit()
    todo_record_data = todo_record.as_dict()
    return todo_record_data


def toggle_todo_record_state_in_db(record_id: str) -> Dict:
    todo_record = ToDoRecord.query.get(record_id)
    if not todo_record:
        error_message = "Invalid todo record id"
        raise APIException(error_message)
    todo_record.is_done = not todo_record.is_done
    db.session.commit()
    todo_record_data = todo_record.as_dict()
    return todo_record_data


def update_todo_record_in_db(
    record_id: str,
    content: str,
    user_name: str,
    user_email: str
) -> Dict:
    todo_record = ToDoRecord.query.get(record_id)
    todo_record.content = content
    todo_record.user_name = user_name
    todo_record.user_email = user_email
    todo_record.is_edited_by_admin = True
    db.session.commit()
    todo_record_data = todo_record.as_dict()
    return todo_record_data
