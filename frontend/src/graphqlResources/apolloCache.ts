import { InMemoryCache } from "@apollo/client";

const apolloCache = new InMemoryCache({
  addTypename: true,
  typePolicies: {
    ToDoRecordsRootQuery: {
      fields: {
        todoRecordList: {
          keyArgs: false,
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

export { apolloCache };
