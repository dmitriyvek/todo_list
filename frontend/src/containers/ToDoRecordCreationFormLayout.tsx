import { useMutation } from "@apollo/client";
import React from "react";
import { toast } from "react-toastify";
import { ToDoRecordCreationForm } from "../components/ToDoRecordCreationForm";
import { TODO_CREATE_MUTATION } from "../graphqlResources/queries";
import {
  RecordCreationParams,
  ToDoRecordCreateResponse,
} from "../graphqlResources/types";

interface ToDoRecordCreationFormLayoutProps {
  updateCallback: () => Promise<any>;
}

const ToDoRecordCreationFormLayout: React.FC<
  ToDoRecordCreationFormLayoutProps
> = ({ updateCallback }) => {
  const [recordCreationMutation] =
    useMutation<ToDoRecordCreateResponse>(TODO_CREATE_MUTATION);

  const onRecordCreationSubmit = async (params: RecordCreationParams) => {
    await recordCreationMutation({
      variables: {
        params: params,
      },
      onCompleted: async () => {
        toast.success("ToDo record was successfully created.");
        await updateCallback();
      },
    });
  };

  const todoRecordCreationForm = (
    <ToDoRecordCreationForm apiRecordCreationCall={onRecordCreationSubmit} />
  );

  return <>{todoRecordCreationForm}</>;
};

export { ToDoRecordCreationFormLayout };
