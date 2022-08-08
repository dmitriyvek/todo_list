import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import React from "react";

interface LoginFormValues {
  username: string;
  password: string;
}

interface LoginFormErrors {
  username?: string;
  password?: string;
}

interface LoginFormProps {
  apiLoginCall: (values: LoginFormValues) => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({ apiLoginCall }) => {
  const initialValues: LoginFormValues = { username: "", password: "" };

  const validate = (values: LoginFormValues) => {
    const errors: LoginFormErrors = {};
    if (!values.username) errors.username = "Username is required";
    if (!values.password) errors.password = "Password is required";
    return errors;
  };

  const onFormSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) => {
    await apiLoginCall({
      username: values.username,
      password: values.password,
    });
    setSubmitting(false);
  };

  const loginForm = (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onFormSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="form-outline mb-4">
            <Field
              className="form-control"
              type="text"
              name="username"
              id="username-input"
            />
            <label className="form-label" htmlFor="username-input">
              User name
            </label>
            <ErrorMessage
              className="text-danger"
              name="username"
              component="div"
            />
          </div>
          <div className="form-outline mb-4">
            <Field
              className="form-control"
              type="password"
              name="password"
              id="password-input"
            />
            <label className="form-label" htmlFor="password-input">
              Password
            </label>
            <ErrorMessage
              className="text-danger"
              name="password"
              component="div"
            />
          </div>
          <button
            className="btn btn-primary btn-block mb-4"
            type="submit"
            disabled={isSubmitting}
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );

  return <>{loginForm}</>;
};

export { LoginForm };
export type { LoginFormValues };
