import { ApolloCache } from "@apollo/client";
import { produce } from "immer";
import { TODO_RECORDS_QUERY } from "./queries";
import { ToDoRecord as ToDoRecordType, ToDoRecordsResponse } from "./types";

const updateToDoRecords = (
  cache: ApolloCache<any>,
  updatedRecordNode: ToDoRecordType
) => {
  const updatedRecordId = updatedRecordNode.recordId;
  const recordsResponse = cache.readQuery<ToDoRecordsResponse>({
    query: TODO_RECORDS_QUERY,
  });
  const recordsEdges = recordsResponse!.todoRecords.todoRecordList.edges;

  const updatedRecordsEdges = recordsEdges.map((record) =>
    produce(record, (updatedRecord) => {
      const recordValues =
        updatedRecord.node.recordId === updatedRecordId
          ? updatedRecordNode
          : updatedRecord.node;
      updatedRecord.node = recordValues;
    })
  );

  const updatedRecordsResponse = produce(
    recordsResponse,
    (updatedRecordsResponse: ToDoRecordsResponse) => {
      updatedRecordsResponse.todoRecords.todoRecordList.edges =
        updatedRecordsEdges;
    }
  );

  cache.writeQuery({
    query: TODO_RECORDS_QUERY,
    data: updatedRecordsResponse,
  });
};

export { updateToDoRecords };
