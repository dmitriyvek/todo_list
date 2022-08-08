import { gql } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation LoginMutation($params: LoginInput!) {
    users {
      login(input: $params) {
        payload {
          authToken
          status
        }
      }
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation {
    users {
      logout {
        payload {
          status
        }
      }
    }
  }
`;

const TODO_RECORDS_QUERY = gql`
  query ToDoRecordsQuery($params: ToDoRecordConnectionParamsType!) {
    todoRecords {
      todoRecordList(params: $params) {
        totalCount
        edges {
          node {
            recordId
            content
            userName
            userEmail
            isEditedByAdmin
            isDone
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

const TODO_CREATE_MUTATION = gql`
  mutation ToDoCreateMutation($params: ToDoRecordCreationInput!) {
    todos {
      create(input: $params) {
        payload {
          record {
            recordId
            content
            userName
            userEmail
            isEditedByAdmin
            isDone
          }
          id
        }
      }
    }
  }
`;

const TODO_TOGGLE_STATE_MUTATION = gql`
  mutation ToDoToggleStateMutation($params: ToDoRecordStateToggleInput!) {
    todos {
      toggleState(input: $params) {
        payload {
          record {
            recordId
            content
            userName
            userEmail
            isEditedByAdmin
            isDone
          }
          id
        }
      }
    }
  }
`;

const TODO_UPDATE_MUTATION = gql`
  mutation ToDoUpdateMutation($params: ToDoRecordUpdateInput!) {
    todos {
      update(input: $params) {
        payload {
          record {
            recordId
            content
            userName
            userEmail
            isEditedByAdmin
            isDone
          }
          id
        }
      }
    }
  }
`;

export {
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  TODO_RECORDS_QUERY,
  TODO_CREATE_MUTATION,
  TODO_TOGGLE_STATE_MUTATION,
  TODO_UPDATE_MUTATION,
};
