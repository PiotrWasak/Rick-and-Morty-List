import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";

const baseUrl = "https://rickandmortyapi.com/graphql";

const httpLink = createHttpLink({
  uri: baseUrl,
});

const cache = new InMemoryCache();

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});
