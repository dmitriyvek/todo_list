import { useQuery } from "@apollo/client";
import React from "react";
import { ToDoRecordsHeader } from "../components/ToDoRecordsHeader";
import { DEFAULT_TODO_RECORDS_PAGE_SIZE } from "../constants";
import { TODO_RECORDS_QUERY } from "../graphqlResources/queries";
import { ToDoRecordsResponse } from "../graphqlResources/types";
import { useLogout, useTypedSelector } from "../hooks";
import { ToDoRecordCreationFormLayout } from "./ToDoRecordCreationFormLayout";
import { ToDoRecordsTable } from "./ToDoRecordsTable";

const ToDoRecordsLayout: React.FC = () => {
  const pageSize = DEFAULT_TODO_RECORDS_PAGE_SIZE;

  const logout = useLogout();

  const { orderingField, orderingDirection } = useTypedSelector(
    (state) => state.todoOrdering
  );

  const { refetch: recordsRefetch } = useQuery<ToDoRecordsResponse>(
    TODO_RECORDS_QUERY,
    {
      variables: {
        params: { first: pageSize, orderingDirection, orderingField },
      },
    }
  );

  const todoRecordsLayout = (
    <div>
      <ToDoRecordsHeader logout={logout} />
      <ToDoRecordCreationFormLayout updateCallback={recordsRefetch} />
      <ToDoRecordsTable />
    </div>
  );

  return <>{todoRecordsLayout}</>;
};

export { ToDoRecordsLayout };
