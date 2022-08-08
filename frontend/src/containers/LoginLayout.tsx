import { useMutation } from "@apollo/client";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginForm, LoginFormValues } from "../components/LoginForm";
import { LOGIN_MUTATION } from "../graphqlResources/queries";
import { LoginParams, LoginResponse } from "../graphqlResources/types";
import { useAuthToken } from "../hooks";

const LoginLayout: React.FC = () => {
  const navigate = useNavigate();
  const [authToken, setAuthToken, removeAuthToken] = useAuthToken();

  const navigateOnRootPage = () => navigate("/");

  const [loginMutation] = useMutation(LOGIN_MUTATION, {
    onCompleted: (response: LoginResponse) => {
      setAuthToken(response.users.login.payload.authToken);
    },
  });

  const login = async (params: LoginParams) => {
    if (authToken) removeAuthToken();
    await loginMutation({
      variables: {
        params: params,
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onCompleted: navigateOnRootPage,
    });
  };

  const onLoginFormSubmit = async (values: LoginFormValues) => {
    await login({ username: values.username, password: values.password });
  };

  const loginForm = <LoginForm apiLoginCall={onLoginFormSubmit} />;

  return <>{loginForm}</>;
};

export { LoginLayout };
