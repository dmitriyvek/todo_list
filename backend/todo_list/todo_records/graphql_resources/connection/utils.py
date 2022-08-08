from copy import deepcopy
from operator import gt, lt
from types import FunctionType
from typing import Any, Dict, List, Optional, Tuple, Type, TypeVar, Union

from flask import current_app
from flask_sqlalchemy import BaseQuery
from graphene import ObjectType
from graphene.relay import Connection, PageInfo
from graphql_relay import from_global_id, to_global_id
from sqlalchemy.orm.attributes import InstrumentedAttribute
from sqlalchemy.sql import and_, or_
from sqlalchemy.sql.elements import BooleanClauseList

from todo_list.db_engine import db

from .exceptions import GQLParamValidationException
from .types import BaseConnectionParamsType, OrderingDirectionEnum

TYPE_POSITION_IN_CURSOR = 0
ID_POSITION_IN_CURSOR = 1
ID_CURSOR_DELIMITER = ";"


ConnectionInstanceType = TypeVar('ConnectionInstanceType', bound=Connection)
ConnectionParamsType = TypeVar('ConnectionParamsType', bound=BaseConnectionParamsType)


def validate_connection_params(
    params: ConnectionParamsType,
    node_type: Type[ObjectType],
    available_ordering_fields: Union[Dict[str, str], Tuple],
) -> ConnectionParamsType:
    params = validate_first_and_last_params(params)
    params = validate_after_and_before_params(params, node_type)
    params = validate_ordering_params(params, available_ordering_fields)

    return params


def validate_first_and_last_params(params: ConnectionParamsType) -> ConnectionParamsType:

    def is_param_valid(param: int) -> bool:
        is_valid = not (param > max_fetch_number or param <= 0)
        return is_valid

    params = deepcopy(params)
    max_fetch_number = current_app.config.MAX_FETCH_NUMBER
    first_param = params.first
    last_param = params.last

    if first_param and last_param:
        error_message = "can't process 'first' and 'last' params simultaneously"
        raise GQLParamValidationException(error_message)
    if first_param and not is_param_valid(first_param):
        params.first = max_fetch_number
    if last_param and not is_param_valid(last_param):
        params.last = None
    if not (first_param or last_param):
        params.first = max_fetch_number

    return params


def validate_after_and_before_params(
    params: ConnectionParamsType, node_type: Type[ObjectType],
) -> ConnectionParamsType:
    params = deepcopy(params)

    if params.after and params.before:
        error_message = "can't process 'after' and 'before' params simultaneously"
        raise GQLParamValidationException(error_message)

    for key in ("after", "before"):
        param = getattr(params, key)
        if param:
            try:
                decoded_param = from_global_id(param)
                cursor_type = decoded_param[TYPE_POSITION_IN_CURSOR]
                cursor_id = decoded_param[ID_POSITION_IN_CURSOR]
                validate_cursor_type(cursor_type, node_type)
                validate_cursor_id(cursor_id)

                setattr(params, key, cursor_id)
            except Exception:
                error_message = "value of '{key}' is not a valid cursor".format(key=key)
                raise GQLParamValidationException(error_message)

    return params


def validate_cursor_type(cursor_type: str, node_type: Type[ObjectType]) -> None:
    is_right_type = cursor_type == node_type.__name__
    if not is_right_type:
        raise Exception


def validate_cursor_id(cursor_id: str) -> None:
    cursor_id = cursor_id
    main_field_value, id_field_value = cursor_id.split(ID_CURSOR_DELIMITER)
    assert main_field_value and id_field_value
    assert int(id_field_value)


def validate_ordering_params(
    params: ConnectionParamsType,
    available_ordering_fields: Union[Dict[str, str], Tuple],
) -> ConnectionParamsType:
    params = deepcopy(params)
    ordering_field = params.ordering_field

    if ordering_field not in available_ordering_fields:
        error_message = 'order field {field} is not in {available}'.format(
            field=ordering_field, available=available_ordering_fields
        )
        raise GQLParamValidationException(error_message)

    return params


def modify_query_by_connection_params(
    query: BaseQuery,
    params: ConnectionParamsType,
    model: db.Model,
) -> BaseQuery:
    query = modify_query_by_after_and_before_params(query, params, model)
    query = modify_query_by_ordering_direction_param(query, params, model)
    query = modify_query_by_first_and_last_params(query, params)

    return query


def modify_query_by_after_and_before_params(
    query: BaseQuery,
    params: ConnectionParamsType,
    model: db.Model,
) -> BaseQuery:
    after_param = params.after
    before_param = params.before
    ordering_direction = params.ordering_direction
    ordering_field = params.ordering_field

    id_cursor = after_param or before_param

    if id_cursor:
        main_column_value, id_column_value = id_cursor.split(ID_CURSOR_DELIMITER)
        main_ordering_column = getattr(model, ordering_field)

        is_asc_ordering = ordering_direction == OrderingDirectionEnum.ASC.value
        if after_param:
            operation = gt if is_asc_ordering else lt
        elif before_param:
            operation = lt if is_asc_ordering else gt

        where_filter = get_lexicographical_where_filter(
            operation=operation,
            first_column=main_ordering_column,
            first_column_value=main_column_value,
            second_column=model.id,
            second_column_value=int(id_column_value),
        )
        query = query.where(where_filter)

    return query


def get_lexicographical_where_filter(
    operation: FunctionType,
    first_column: InstrumentedAttribute,
    first_column_value: Any,
    second_column: InstrumentedAttribute,
    second_column_value: Any,
) -> BooleanClauseList:
    where_filter = or_(
        operation(first_column, first_column_value),
        and_(
            first_column == first_column_value,
            operation(second_column, second_column_value)
        )
    )
    return where_filter


def modify_query_by_ordering_direction_param(
    query: BaseQuery,
    params: ConnectionParamsType,
    model: db.Model,
) -> BaseQuery:
    last_param = params.last
    ordering_field = params.ordering_field
    ordering_direction = params.ordering_direction

    if last_param:
        ordering_direction = OrderingDirectionEnum.get_opposite_ordering_directions(
            ordering_direction=ordering_direction
        )

    ordering_direction = ordering_direction.lower()
    main_ordering_column = getattr(model, ordering_field)
    main_ordering_column = getattr(main_ordering_column, ordering_direction)
    id_ordering_column = getattr(model.id, ordering_direction)
    query = query.order_by(main_ordering_column(), id_ordering_column())

    return query


def modify_query_by_first_and_last_params(
    query: BaseQuery,
    params: ConnectionParamsType,
) -> BaseQuery:
    # take 1 more to understand if there are more entries in table
    last_param = params.last and params.last + 1
    first_param = params.first and params.first + 1
    limit = last_param or first_param
    query = query.limit(limit)

    return query


def create_connection(
    record_list: List[Dict],
    params: ConnectionParamsType,
    connection_type: Type[Connection],
    node_type: Type[ObjectType],
    pageinfo_type: Type[PageInfo] = PageInfo,
    id_column: Optional[str] = 'id',
) -> ConnectionInstanceType:
    edge_type = connection_type.Edge

    after_param = params.after
    before_param = params.before
    first_param = params.first
    last_param = params.last
    ordering_field = params.ordering_field
    has_previous_page = False
    has_next_page = False
    result_length = len(record_list)

    if last_param:
        record_list.reverse()

    if result_length:
        if after_param:
            has_previous_page = True
        if before_param:
            has_next_page = True

        if first_param and result_length == first_param + 1:
            has_next_page = True
            record_list.pop()

        elif last_param and result_length == last_param + 1:
            has_previous_page = True
            record_list.pop(0)

    edge_list = [
        edge_type(
            node=node, cursor=create_node_cursor(
                node_type, node[ordering_field], node[id_column]
            )
        )
        for node in record_list
    ]

    first_edge_cursor = edge_list[0].cursor if edge_list else None
    last_edge_cursor = edge_list[-1].cursor if edge_list else None

    connection = connection_type(
        edges=edge_list,
        page_info=pageinfo_type(
            start_cursor=first_edge_cursor,
            end_cursor=last_edge_cursor,
            has_previous_page=has_previous_page,
            has_next_page=has_next_page
        )
    )
    return connection


def create_node_cursor(node: Type[ObjectType], main_param: str, id_param: str) -> str:
    node_type = node.__name__
    node_id = "{main_param}{delimiter}{id_param}".format(
        main_param=main_param,
        delimiter=ID_CURSOR_DELIMITER,
        id_param=id_param,
    )
    cursor = to_global_id(node_type, node_id)
    return cursor
