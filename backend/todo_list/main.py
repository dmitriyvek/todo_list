from dynaconf import FlaskDynaconf
from flask import Flask
from flask_cors import CORS

from .db_engine import initialize_db_engine
from .loggers import setup_logger
from .view import graphql_view


def get_default_app() -> Flask:
    app = Flask(__name__)
    return app


def initialize_app_config(app: Flask) -> None:
    FlaskDynaconf(app)


def initialize_cors(app: Flask) -> None:
    CORS(app)


def initialize_urls(app: Flask) -> None:
    app.add_url_rule('/graphql', view_func=graphql_view)


def initialize_loggers(app: Flask) -> None:
    log_level = app.config.LOG_LEVEL
    app.logger = setup_logger(log_level)


def create_app():
    app = get_default_app()
    initialize_app_config(app)
    initialize_db_engine(app)
    initialize_cors(app)
    initialize_urls(app)
    initialize_loggers(app)

    return app
