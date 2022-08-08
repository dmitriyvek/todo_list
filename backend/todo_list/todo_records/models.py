from typing import Dict

from todo_list.db_engine import db


class ToDoRecord(db.Model):
    __tablename__ = 'todo_record'

    available_ordering_fields = ['user_name', 'user_email', 'is_done']
    default_ordering_field = available_ordering_fields[0]

    id = db.Column(
        db.Integer,
        primary_key=True,
    )
    content = db.Column(
        db.Text,
    )
    user_name = db.Column(
        db.Text,
    )
    user_email = db.Column(
        db.Text,
    )
    is_done = db.Column(
        db.Boolean,
        nullable=False,
        default=False,
    )
    is_edited_by_admin = db.Column(
        db.Boolean,
        nullable=False,
        default=False,
    )

    def __repr__(self):
        return f'<ToDoRecord id={self.id}>'

    def as_dict(self) -> Dict:
        as_dict = {
            'id': self.id,
            'content': self.content,
            'user_name': self.user_name,
            'user_email': self.user_email,
            'is_done': self.is_done,
            'is_edited_by_admin': self.is_edited_by_admin,
        }
        return as_dict
