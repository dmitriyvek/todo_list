from graphene import Enum, Field, InputObjectType, ObjectType, String


class ResponseStatus(Enum):
    SUCCESS = 'success'
    FAILED = 'failed'

    @property
    def description(self):
        if self == ResponseStatus.SUCCESS:
            return 'Request processed successfully'
        elif self == ResponseStatus.FAILED:
            return 'Failed to process request'


class LoginInput(InputObjectType):
    username = String(required=True)
    password = String(required=True)


class LoginPayload(ObjectType):
    auth_token = String(required=True)
    status = Field(ResponseStatus, required=True)


class LogoutPayload(ObjectType):
    status = Field(ResponseStatus, required=True)
