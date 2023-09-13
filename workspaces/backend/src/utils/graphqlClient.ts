import { GraphQLClient } from 'graphql-request';

// Replace with your GraphQL API endpoint
const endpoint = 'https://hub.snapshot.org/graphql';

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
  }
});
