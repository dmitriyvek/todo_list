import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  NormalizedCacheObject,
} from "@apollo/client";
import { useMemo } from "react";
import { useAuthToken } from "../hooks";

import { apolloCache } from "./apolloCache";

type useAppApolloClientType = () => ApolloClient<NormalizedCacheObject>;

const gqlServerUrl = process.env.REACT_APP_GRAPHQL_URL;
const httpLink = new HttpLink({
  uri: gqlServerUrl,
});

const authMiddleware = (authToken: string) =>
  new ApolloLink((operation, forward) => {
    if (authToken) {
      const authHeaderValue = `Bearer ${authToken}`;
      operation.setContext({
        headers: {
          Authorization: authHeaderValue,
        },
      });
    }

    return forward(operation);
  });

const useAppApolloClient: useAppApolloClientType = () => {
  const [authToken] = useAuthToken();
  const gqlLink = authMiddleware(authToken).concat(httpLink);
  return useMemo(
    () =>
      new ApolloClient({
        link: gqlLink,
        cache: apolloCache,
      }),
    [authToken]
  );
};

export { useAppApolloClient };
