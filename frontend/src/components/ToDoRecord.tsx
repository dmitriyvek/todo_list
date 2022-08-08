import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import React, { FormEvent, useState } from "react";
import { isEmailValid } from "../utils";

interface RecordUpdateFormValues {
  id: number;
  userName: string;
  userEmail: string;
  content: string;
}

interface RecordUpdateFormErrors {
  userName?: string;
  userEmail?: string;
  content?: string;
}

interface ToDoRecordProps {
  username: string;
  email: string;
  content: string;
  isDone: boolean;
  isEditedByAdmin: boolean;
  recordId: number;
  rowIsUpdatable: boolean;
  apiToggleStateCall: (id: number) => Promise<void>;
  apiUpdateRecordCall: (params: RecordUpdateFormValues) => Promise<void>;
}

const ToDoRecord: React.FC<ToDoRecordProps> = ({
  username,
  email,
  content,
  isDone,
  isEditedByAdmin,
  recordId,
  rowIsUpdatable,
  apiToggleStateCall,
  apiUpdateRecordCall,
}) => {
  const recordUpdateFormId = `record-update-form-${recordId}`;

  const [updateFormIsOpen, setUpdateFormIsOpen] = useState(false);

  const onToggleState = async (event: FormEvent) =>
    await apiToggleStateCall(recordId);

  const onUpdateClick = (event: FormEvent) => {
    event.stopPropagation();
    setUpdateFormIsOpen(!updateFormIsOpen);
  };

  const initialValues: RecordUpdateFormValues = {
    userName: username,
    userEmail: email,
    content: content,
    id: recordId,
  };

  const validate = (values: RecordUpdateFormValues) => {
    const errors: RecordUpdateFormErrors = {};
    if (!values.userName) errors.userName = "Username is required";
    if (!values.content) errors.content = "Content is required";
    if (!values.userEmail) errors.userEmail = "Email is required";
    else if (!isEmailValid(values.userEmail))
      errors.userEmail = "Email is invalid";
    return errors;
  };

  const onFormSubmit = async (
    values: RecordUpdateFormValues,
    { setSubmitting, resetForm }: FormikHelpers<RecordUpdateFormValues>
  ) => {
    await apiUpdateRecordCall({
      id: values.id,
      userName: values.userName,
      userEmail: values.userEmail,
      content: values.content,
    });
    setSubmitting(false);
    setUpdateFormIsOpen(false);
    resetForm();
  };

  const recordUpdateForm = updateFormIsOpen ? (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onFormSubmit}
    >
      {({ isSubmitting }) => (
        <tr>
          <td>
            <Form id={recordUpdateFormId}>
              <Field
                className="form-control"
                type="text"
                name="userName"
                id="username-input"
                placeholder="User email"
              />
              <ErrorMessage
                className="text-danger"
                name="userName"
                component="div"
              />
            </Form>
          </td>
          <td>
            <Field
              className="form-control"
              type="text"
              name="userEmail"
              id="email-input"
              placeholder="Email"
              form={recordUpdateFormId}
            />
            <ErrorMessage
              className="text-danger"
              name="userEmail"
              component="div"
            />
          </td>
          <td>
            <Field
              className="form-control"
              type="text"
              name="content"
              id="content-input"
              placeholder="Content"
              form={recordUpdateFormId}
            />
            <ErrorMessage
              className="text-danger"
              name="content"
              component="div"
            />
          </td>
          <td></td>
          <td></td>
          <td>
            <button
              className="btn btn-primary btn-block mb-4"
              type="submit"
              disabled={isSubmitting}
              form={recordUpdateFormId}
            >
              Save
            </button>
          </td>
        </tr>
      )}
    </Formik>
  ) : null;

  const todoRecordElem = (
    <tr className="todo-record-row">
      <td>{username}</td>
      <td>{email}</td>
      <td>{content}</td>
      <td onClick={onToggleState} className="text-center">
        <input type="checkbox" checked={isDone} readOnly={true} />
      </td>
      <td className="text-center">
        <input type="checkbox" checked={isEditedByAdmin} readOnly={true} />
      </td>
      <td>
        <button
          type="button"
          className="btn btn-primary todo-record-update-btn"
          onClick={onUpdateClick}
          disabled={!rowIsUpdatable}
        >
          Update
        </button>
      </td>
    </tr>
  );

  const todoRecord = (
    <>
      {todoRecordElem}
      {recordUpdateForm}
    </>
  );

  return <>{todoRecord}</>;
};

export { ToDoRecord };
