"""Initial User, BlacklistedToken and ToDoRecord models

Revision ID: 89f2555ddf44
Revises: 
Create Date: 2022-08-04 18:20:24.494900

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql.schema import Table
from werkzeug.security import generate_password_hash

# revision identifiers, used by Alembic.
revision = '89f2555ddf44'
down_revision = None
branch_labels = None
depends_on = None


def create_admin_user(user_table: Table) -> None:
    op.bulk_insert(
        user_table,
        [
            {
                'id': 1,
                'username': 'admin',
                'password': generate_password_hash('123'),
                'is_admin': True,
            },
        ]
    )


def upgrade():
    op.create_table(
        'blacklisted_token',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('token', sa.Text(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('token')
    )
    op.create_table(
        'todo_record',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('user_name', sa.Text(), nullable=True),
        sa.Column('user_email', sa.Text(), nullable=True),
        sa.Column('is_done', sa.Boolean(), nullable=False),
        sa.Column('is_edited_by_admin', sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    user_table = op.create_table(
        'user',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(length=255), nullable=False),
        sa.Column('password', sa.Text(), nullable=False),
        sa.Column('is_admin', sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('username')
    )

    create_admin_user(user_table)


def downgrade():
    op.drop_table('user')
    op.drop_table('todo_record')
    op.drop_table('blacklisted_token')
