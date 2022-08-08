import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ToDoRecord } from "../components/ToDoRecord";
import { ToDoRecordsPagination } from "../components/ToDoRecordsPagination";
import { ToDoRecordsTableHeader } from "../components/ToDoRecordsTableHeader";
import { DEFAULT_TODO_RECORDS_PAGE_SIZE } from "../constants";
import {
  TODO_RECORDS_QUERY,
  TODO_TOGGLE_STATE_MUTATION,
  TODO_UPDATE_MUTATION,
} from "../graphqlResources/queries";
import {
  RecordUpdateInput,
  ToDoRecordConnectionInput,
  ToDoRecordsResponse,
  ToDoRecordToggleResponse,
  ToDoRecordUpdateResponse,
} from "../graphqlResources/types";
import { updateToDoRecords } from "../graphqlResources/utils";
import { useAuthToken, useTypedSelector } from "../hooks";
import * as todoOrderingActions from "../store/actions/todoOrdering";
import { DEFAULT_TODO_ORDERING_DIRECTION } from "../constants";

const ToDoRecordsTable: React.FC = () => {
  const pageSize = DEFAULT_TODO_RECORDS_PAGE_SIZE;

  const dispatch = useDispatch();

  const orderingChange = (orderingField: string, orderingDirection: string) =>
    dispatch(
      todoOrderingActions.changeOrdering({ orderingField, orderingDirection })
    );

  const { orderingField, orderingDirection } = useTypedSelector(
    (state) => state.todoOrdering
  );

  const {
    data: recordsData,
    fetchMore: recordsFetchMore,
    refetch: recordsRefetch,
  } = useQuery<ToDoRecordsResponse>(TODO_RECORDS_QUERY, {
    variables: {
      params: { first: pageSize, orderingDirection, orderingField },
    },
  });

  const [authToken] = useAuthToken();
  const isAuthorized = Boolean(authToken);

  const [toggleRecordStateMutation] = useMutation<ToDoRecordToggleResponse>(
    TODO_TOGGLE_STATE_MUTATION,
    {
      update(cache, result) {
        const toggledRecordRecordValues =
          result.data!.todos.toggleState.payload.record;
        updateToDoRecords(cache, toggledRecordRecordValues);
      },
    }
  );

  const [updateRecordMutation] = useMutation<ToDoRecordUpdateResponse>(
    TODO_UPDATE_MUTATION,
    {
      update(cache, result) {
        const updatedTodoRecordValues =
          result.data!.todos.update.payload.record;
        updateToDoRecords(cache, updatedTodoRecordValues);
      },
    }
  );

  useEffect(() => {
    recordsRefetch();
  }, [orderingField, orderingDirection]);

  const fetchRecordsChunk = async (params: ToDoRecordConnectionInput) => {
    await recordsFetchMore({
      variables: {
        params: {
          ...params,
          orderingField: orderingField,
          orderingDirection: orderingDirection,
        },
      },
    });
  };

  const fetchPrevRecordsChunk = async () => {
    await fetchRecordsChunk({
      last: pageSize,
      before: recordsData?.todoRecords.todoRecordList.pageInfo.startCursor,
    });
  };

  const fetchNextRecordsChunk = async () => {
    await fetchRecordsChunk({
      first: pageSize,
      after: recordsData?.todoRecords.todoRecordList.pageInfo.endCursor,
    });
  };

  const toggleRecordState = async (id: number) => {
    await toggleRecordStateMutation({
      variables: {
        params: {
          id,
        },
      },
    });
  };

  const updateRecord = async (params: RecordUpdateInput) => {
    await updateRecordMutation({
      variables: {
        params: params,
      },
      onError: (error) => toast.error(error.message),
    });
  };

  const tableHeader = (
    <ToDoRecordsTableHeader
      orderingDirection={orderingDirection}
      orderingField={orderingField}
      defaultOrderingDirection={DEFAULT_TODO_ORDERING_DIRECTION}
      setOrdering={orderingChange}
    />
  );

  const createRecordsComponents = (
    recordsData: ToDoRecordsResponse | undefined
  ) => {
    if (recordsData) {
      const todoRecords = recordsData.todoRecords.todoRecordList.edges;
      const recordsComponents = todoRecords.map((recordNode) => {
        const id = recordNode.node.recordId;
        const username = recordNode.node.userName;
        const email = recordNode.node.userEmail;
        const content = recordNode.node.content;
        const isDone = recordNode.node.isDone;
        const isEditedByAdmin = recordNode.node.isEditedByAdmin;
        return (
          <ToDoRecord
            key={id}
            recordId={id}
            username={username}
            email={email}
            content={content}
            isDone={isDone}
            isEditedByAdmin={isEditedByAdmin}
            apiToggleStateCall={toggleRecordState}
            apiUpdateRecordCall={updateRecord}
            rowIsUpdatable={isAuthorized}
          />
        );
      });
      return recordsComponents;
    }
    return null;
  };
  const todoRecordsComponents = createRecordsComponents(recordsData);

  const createRecordsPagination = (
    recordsData: ToDoRecordsResponse | undefined
  ) => {
    if (recordsData) {
      const pageInfo = recordsData.todoRecords.todoRecordList.pageInfo;
      const recordsPagination = (
        <ToDoRecordsPagination
          hasPrev={pageInfo.hasPreviousPage}
          hasNext={pageInfo.hasNextPage}
          fetchPrevRecordsChunk={fetchPrevRecordsChunk}
          fetchNextRecordsChunk={fetchNextRecordsChunk}
        />
      );
      return recordsPagination;
    }
    return null;
  };
  let todoRecordsPagination = createRecordsPagination(recordsData);

  const todoRecordsTable = (
    <div className="table-responsive">
      <table className="table table-striped table-bordered">
        {tableHeader}
        <tbody>{todoRecordsComponents}</tbody>
      </table>
      {todoRecordsPagination}
    </div>
  );

  return <>{todoRecordsTable}</>;
};

export { ToDoRecordsTable };
