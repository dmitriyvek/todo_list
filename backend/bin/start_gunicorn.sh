#!/bin/bash
source /home/www/code/todo_list/backend/.venv/bin/activate
flask db upgrade
exec gunicorn -c "/home/www/code/todo_list/backend/config/gunicorn_config.py" wsgi:app
