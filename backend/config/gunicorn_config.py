command = '/home/www/code/todo_list/backend/.venv/bin/gunicorn'
pythonpath = '/home/www/code/todo_list/backend'
bind = '0.0.0.0:8000'
workers = 3
user = 'www'
limit_request_fields = 32000
limit_request_field_size = 0
raw_env = 'FLASK_APP=wsgi.py'
loglevel = 'info'
accesslog = '/home/www/code/todo_list/log/gunicorn/access.log'
acceslogformat = '%(h)s %(l)s %(u)s %(t)s %(r)s %(s)s %(b)s %(f)s %(a)s'
errorlog = '/home/www/code/todo_list/log/gunicorn/error.log'
