from graphene import Enum, InputObjectType, Int, String


class OrderingDirectionEnum(Enum):
    DESC = 'DESC'
    ASC = 'ASC'

    @staticmethod
    def get_opposite_ordering_directions(ordering_direction: str) -> str:
        ordering_direction = ordering_direction.upper()
        available_ordering_directions = ['DESC', 'ASC']
        assert ordering_direction in available_ordering_directions
        opposite_direction = next(
            direction for direction in available_ordering_directions if direction != ordering_direction
        )
        return opposite_direction


class BaseConnectionParamsType(InputObjectType):
    first = Int(
        description='Limit of elements from the beginning of the selection.'
    )
    after = String(
        description='Cursor pointing to an element.'
                    'The selection starts from the next element after the one specified in the cursor.',
    )
    last = Int(
        description='Limit of elements from the end of the selection.',
    )
    before = String(
        description='Cursor pointing to an element.'
                    'The selection will end at the element before the one specified in the cursor.',
    )
    ordering_field = String(
        description='The name of the field to sort by. The rest of the params apply to it.',
        default_value=None,
    )
    ordering_direction = OrderingDirectionEnum(
        description='Sorting direction.',
        default_value=OrderingDirectionEnum.ASC.value,
    )
