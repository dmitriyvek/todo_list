from functools import partial

from flask import current_app

from .exceptions import APIException


class GraphQLErrorMiddleware:

    def on_error(self, error, logger):
        if not isinstance(error, APIException):
            logger.exception(error)
            raise APIException('Internal server error.', status=500)

        raise error

    def resolve(self, next, root, info, **args):
        assert getattr(current_app, 'logger'), 'Logger is not initialized'
        logger = current_app.logger

        return next(root, info, **args).catch(
            partial(
                self.on_error,
                logger=logger,
            )
        )
