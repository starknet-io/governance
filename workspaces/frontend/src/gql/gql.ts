/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\nquery Votes($where: VoteWhere) {\n  votes(where: $where)  {\n    id,\n    choice\n  }}": types.VotesDocument,
    "query Proposal($voter: String!, $space: String!, $proposal: String) {\n      proposal(id: $proposal) {\n      id\n      author\n      title\n      body\n      choices\n      votes\n      scores\n      start\n      end\n      state\n      discussion\n      ipfs\n      type\n      scores_by_strategy\n      scores_state\n      scores_total\n      scores_updated\n      snapshot\n        strategies {\n          network\n          params\n        }\n      }\n      vp(voter: $voter, space: $space, proposal: $proposal) {\n        vp\n        vp_by_strategy\n        vp_state\n      }\n    }": types.ProposalDocument,
    "\nquery proposals($space: String!) {\n  proposals(first: 20, skip: 0, where: {space: $space}, orderBy: \"created\", orderDirection: desc) {\n    id\n    title\n    choices\n    start\n    end\n    snapshot\n    state\n    scores\n    scores_total\n    author\n    space {\n      id\n      name\n    }\n  }\n}\n  ": types.ProposalsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery Votes($where: VoteWhere) {\n  votes(where: $where)  {\n    id,\n    choice\n  }}"): (typeof documents)["\nquery Votes($where: VoteWhere) {\n  votes(where: $where)  {\n    id,\n    choice\n  }}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query Proposal($voter: String!, $space: String!, $proposal: String) {\n      proposal(id: $proposal) {\n      id\n      author\n      title\n      body\n      choices\n      votes\n      scores\n      start\n      end\n      state\n      discussion\n      ipfs\n      type\n      scores_by_strategy\n      scores_state\n      scores_total\n      scores_updated\n      snapshot\n        strategies {\n          network\n          params\n        }\n      }\n      vp(voter: $voter, space: $space, proposal: $proposal) {\n        vp\n        vp_by_strategy\n        vp_state\n      }\n    }"): (typeof documents)["query Proposal($voter: String!, $space: String!, $proposal: String) {\n      proposal(id: $proposal) {\n      id\n      author\n      title\n      body\n      choices\n      votes\n      scores\n      start\n      end\n      state\n      discussion\n      ipfs\n      type\n      scores_by_strategy\n      scores_state\n      scores_total\n      scores_updated\n      snapshot\n        strategies {\n          network\n          params\n        }\n      }\n      vp(voter: $voter, space: $space, proposal: $proposal) {\n        vp\n        vp_by_strategy\n        vp_state\n      }\n    }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery proposals($space: String!) {\n  proposals(first: 20, skip: 0, where: {space: $space}, orderBy: \"created\", orderDirection: desc) {\n    id\n    title\n    choices\n    start\n    end\n    snapshot\n    state\n    scores\n    scores_total\n    author\n    space {\n      id\n      name\n    }\n  }\n}\n  "): (typeof documents)["\nquery proposals($space: String!) {\n  proposals(first: 20, skip: 0, where: {space: $space}, orderBy: \"created\", orderDirection: desc) {\n    id\n    title\n    choices\n    start\n    end\n    snapshot\n    state\n    scores\n    scores_total\n    author\n    space {\n      id\n      name\n    }\n  }\n}\n  "];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;