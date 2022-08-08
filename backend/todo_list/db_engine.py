from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
alembic = Migrate()


def initialize_db_engine(app: Flask) -> None:
    db_config = app.config.DATABASE
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://{user}:{password}@{host}:{port}/{db_name}'.format(
        user=db_config.USERNAME,
        password=db_config.PASSWORD,
        host=db_config.HOST,
        port=db_config.PORT,
        db_name=db_config.DATABASE_NAME,
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    alembic.init_app(app, db)
