from flask_graphql import GraphQLView
from graphene import Schema

from .exceptions import error_formatter
from .middleware import GraphQLErrorMiddleware
from .mutation import Mutation
from .query import Query


def make_graphql_view():
    schema = Schema(query=Query, mutation=Mutation, auto_camelcase=True)
    view = GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True,
        error_formatter=error_formatter,
        middleware=[
            GraphQLErrorMiddleware(),
        ]
    )

    return view


graphql_view = make_graphql_view()
