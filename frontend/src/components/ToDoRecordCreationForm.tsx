import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import React from "react";
import { isEmailValid } from "../utils";

interface RecordCreationFormValues {
  userName: string;
  userEmail: string;
  content: string;
}

interface RecordCreationFormErrors {
  userName?: string;
  userEmail?: string;
  content?: string;
}

interface ToDoRecordCreationFormProps {
  apiRecordCreationCall: (params: RecordCreationFormValues) => Promise<void>;
}

const ToDoRecordCreationForm: React.FC<ToDoRecordCreationFormProps> = ({
  apiRecordCreationCall,
}) => {
  const initialValues: RecordCreationFormValues = {
    userName: "",
    userEmail: "",
    content: "",
  };

  const validate = (values: RecordCreationFormValues) => {
    const errors: RecordCreationFormErrors = {};
    if (!values.userName) errors.userName = "Username is required";
    if (!values.content) errors.content = "Content is required";
    if (!values.userEmail) errors.userEmail = "Email is required";
    else if (!isEmailValid(values.userEmail))
      errors.userEmail = "Email is invalid";
    return errors;
  };

  const onFormSubmit = async (
    values: RecordCreationFormValues,
    { setSubmitting, resetForm }: FormikHelpers<RecordCreationFormValues>
  ) => {
    await apiRecordCreationCall({
      userName: values.userName,
      userEmail: values.userEmail,
      content: values.content,
    });
    setSubmitting(false);
    resetForm();
  };

  const recordCreationForm = (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onFormSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="row row-cols-lg-auto g-3 justify-content-center align-items-center mb-4 pb-2">
          <div className="col-12">
            <div className="form-outline">
              <Field
                className="form-control mb-1"
                type="text"
                name="userName"
                id="username-input"
                placeholder="User name"
              />
              <ErrorMessage
                className="text-danger"
                name="userName"
                component="div"
              />
              <Field
                className="form-control mb-1"
                type="text"
                name="userEmail"
                id="email-input"
                placeholder="Email"
              />
              <ErrorMessage
                className="text-danger"
                name="userEmail"
                component="div"
              />
              <Field
                className="form-control mb-1"
                type="text"
                name="content"
                id="content-input"
                placeholder="Content"
              />
              <ErrorMessage
                className="text-danger"
                name="content"
                component="div"
              />
            </div>
          </div>
          <div className="col-12">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={isSubmitting}
            >
              Create
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );

  return <>{recordCreationForm}</>;
};

export { ToDoRecordCreationForm };
