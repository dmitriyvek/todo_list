from todo_list import create_app


app = create_app()


if __name__ == '__main__':
    host = app.config.HTTP.HOST
    port = app.config.HTTP.PORT
    app.run(host=host, port=port)
