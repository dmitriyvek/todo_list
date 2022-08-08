from graphene.utils.str_converters import to_camel_case
from graphql_server import default_format_error


class APIException(Exception):

    def __init__(self, message, **kwargs):
        if kwargs:
            self.context = {
                to_camel_case(key): value
                for key, value in kwargs.items()
            }

        super().__init__(message)


def error_formatter(error):
    formatted_error = default_format_error(error)

    try:
        formatted_error.update(error.original_error.context)
    except AttributeError:
        pass

    return formatted_error
