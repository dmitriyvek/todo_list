from werkzeug.security import generate_password_hash

from todo_list.db_engine import db


class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(
        db.Integer,
        primary_key=True,
    )
    username = db.Column(
        db.String(255),
        unique=True,
        nullable=False,
    )
    password = db.Column(
        db.Text,
        nullable=False,
    )
    is_admin = db.Column(
        db.Boolean,
        nullable=False,
        default=False,
    )

    def __init__(self, username: str, password: str):
        self.username = username
        self.password = generate_password_hash(password)

    def __repr__(self):
        return f'<User id={self.id}; username={self.username}>'


class BlacklistedToken(db.Model):
    __tablename__ = 'blacklisted_token'

    id = db.Column(
        db.Integer,
        primary_key=True,
    )
    token = db.Column(
        db.Text,
        unique=True,
        nullable=False,
    )

    def __repr__(self):
        return f'<BlacklistedToken id={self.id}>'
