import { FetchResult, useApolloClient, useMutation } from "@apollo/client";
import jwt_decode from "jwt-decode";
import { useCookies } from "react-cookie";
import { TypedUseSelectorHook, useSelector } from "react-redux";

import { LOGOUT_MUTATION } from "./graphqlResources/queries";

import type {
  AuthTokenPayload,
  LogoutResponse,
} from "./graphqlResources/types";
import { RootState } from "./store/reducers/rootReducer";

type setAuthTokenFuncType = (authToken: string) => void;
type removeAuthTokenFunctionType = () => void;

const useAuthToken = (): [
  string,
  (authToken: string) => void,
  removeAuthTokenFunctionType
] => {
  const TOKEN_NAME = "authToken";
  const [cookies, setCookie, removeCookie] = useCookies([TOKEN_NAME]);

  const setAuthToken: setAuthTokenFuncType = (authToken) => {
    const decodedToken = jwt_decode<AuthTokenPayload>(authToken);
    const authTokenExpirationDate = new Date(decodedToken.exp * 1000);
    setCookie(TOKEN_NAME, authToken, { expires: authTokenExpirationDate });
  };

  const removeAuthToken: removeAuthTokenFunctionType = () =>
    removeCookie(TOKEN_NAME);

  return [cookies[TOKEN_NAME], setAuthToken, removeAuthToken];
};

const useLogout = (): (() => Promise<
  FetchResult<LogoutResponse, Record<string, any>, Record<string, any>>
>) => {
  const [, , removeAuthToken] = useAuthToken();
  const apolloClient = useApolloClient();

  const [mutation] = useMutation(LOGOUT_MUTATION, {
    onCompleted: async (response: LogoutResponse) => {
      removeAuthToken();
      await apolloClient.clearStore();
    },
  });

  return () => {
    return mutation();
  };
};

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export { useAuthToken, useLogout, useTypedSelector };
