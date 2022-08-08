interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

interface ToDoRecord {
  recordId: number;
  content: string;
  userName: string;
  userEmail: string;
  isEditedByAdmin: boolean;
  isDone: boolean;
}

interface ToDoRecordNode {
  node: ToDoRecord;
}

interface ToDoRecordsResponse {
  todoRecords: {
    todoRecordList: {
      totalCount: number;
      edges: ToDoRecordNode[];
      pageInfo: PageInfo;
    };
  };
}

interface LoginPayload {
  payload: {
    authToken: string;
    status: string;
  };
}

interface LoginResponse {
  users: {
    login: LoginPayload;
  };
}

interface LoginParams {
  username: string;
  password: string;
}

interface RecordCreationParams {
  userName: string;
  userEmail: string;
  content: string;
}

interface LogoutPayload {
  payload: {
    status: string;
  };
}

interface LogoutResponse {
  users: {
    logout: LogoutPayload;
  };
}

interface AuthTokenPayload {
  exp: number;
  iat: number;
  sub: number;
}

interface ToDoRecordPayload {
  payload: {
    record: ToDoRecord;
  };
}

interface ToDoRecordCreateResponse {
  todos: {
    create: ToDoRecordPayload;
    id: number;
  };
}

interface ToDoRecordToggleResponse {
  todos: {
    toggleState: ToDoRecordPayload;
  };
}

interface ToDoRecordUpdateResponse {
  todos: {
    update: ToDoRecordPayload;
  };
}

interface ToDoRecordConnectionInput {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
  orderingDirection?: string;
  orderingField?: string;
}

interface RecordUpdateInput {
  id: number;
  userName: string;
  userEmail: string;
  content: string;
}

export type {
  AuthTokenPayload,
  ToDoRecordsResponse,
  LoginResponse,
  LoginParams,
  LogoutResponse,
  ToDoRecordCreateResponse,
  ToDoRecordConnectionInput,
  ToDoRecordToggleResponse,
  RecordCreationParams,
  RecordUpdateInput,
  ToDoRecordNode,
  ToDoRecordUpdateResponse,
  ToDoRecord,
};
