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
    "\n    query VotingPower($voter: String!, $space: String!) {\n      vp(voter: $voter, space: $space) {\n        vp\n        vp_by_strategy\n        vp_state\n      }\n    }\n  ": types.VotingPowerDocument,
    "\n  query DelegateProfilePageQuery(\n    $voter: String!\n    $space: String!\n    $proposal: String\n    $where: VoteWhere\n  ) {\n    votes(where: $where) {\n      id\n      choice\n      voter\n      reason\n      metadata\n      created\n      proposal {\n        id\n        title\n        body\n        choices\n      }\n      ipfs\n      vp\n      vp_by_strategy\n      vp_state\n    }\n    vp(voter: $voter, space: $space, proposal: $proposal) {\n      vp\n      vp_by_strategy\n      vp_state\n    }\n  }\n": types.DelegateProfilePageQueryDocument,
    "\n  query DelegateProposals($space: String!) {\n    proposals(first: 20, skip: 0, where: {space_in: [$space]}, orderBy: \"created\", orderDirection: desc) {\n      id\n      title\n      choices\n      start\n      end\n      snapshot\n      state\n      scores\n      scores_total\n      author\n      space {\n        id\n        name\n      }\n    }\n  }\n": types.DelegateProposalsDocument,
    "\n  query GetSpaceQuery(\n    $space: String!\n  ) {\n    space(id: $space) {\n      name\n      about\n      network\n      symbol\n      website\n      private\n      admins\n      moderators\n      members\n      categories\n      plugins\n      children {\n        name\n      }\n      voting {\n        hideAbstain\n      }\n      strategies {\n        name\n        network\n        params\n      }\n      validation {\n        name\n        params\n      }\n      voteValidation {\n        name\n        params\n      }\n      filters {\n        minScore\n        onlyMembers\n      }\n      treasuries {\n        name\n        address\n        network\n      }\n    }\n  }\n": types.GetSpaceQueryDocument,
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
export function gql(source: "\n    query VotingPower($voter: String!, $space: String!) {\n      vp(voter: $voter, space: $space) {\n        vp\n        vp_by_strategy\n        vp_state\n      }\n    }\n  "): (typeof documents)["\n    query VotingPower($voter: String!, $space: String!) {\n      vp(voter: $voter, space: $space) {\n        vp\n        vp_by_strategy\n        vp_state\n      }\n    }\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query DelegateProfilePageQuery(\n    $voter: String!\n    $space: String!\n    $proposal: String\n    $where: VoteWhere\n  ) {\n    votes(where: $where) {\n      id\n      choice\n      voter\n      reason\n      metadata\n      created\n      proposal {\n        id\n        title\n        body\n        choices\n      }\n      ipfs\n      vp\n      vp_by_strategy\n      vp_state\n    }\n    vp(voter: $voter, space: $space, proposal: $proposal) {\n      vp\n      vp_by_strategy\n      vp_state\n    }\n  }\n"): (typeof documents)["\n  query DelegateProfilePageQuery(\n    $voter: String!\n    $space: String!\n    $proposal: String\n    $where: VoteWhere\n  ) {\n    votes(where: $where) {\n      id\n      choice\n      voter\n      reason\n      metadata\n      created\n      proposal {\n        id\n        title\n        body\n        choices\n      }\n      ipfs\n      vp\n      vp_by_strategy\n      vp_state\n    }\n    vp(voter: $voter, space: $space, proposal: $proposal) {\n      vp\n      vp_by_strategy\n      vp_state\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query DelegateProposals($space: String!) {\n    proposals(first: 20, skip: 0, where: {space_in: [$space]}, orderBy: \"created\", orderDirection: desc) {\n      id\n      title\n      choices\n      start\n      end\n      snapshot\n      state\n      scores\n      scores_total\n      author\n      space {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query DelegateProposals($space: String!) {\n    proposals(first: 20, skip: 0, where: {space_in: [$space]}, orderBy: \"created\", orderDirection: desc) {\n      id\n      title\n      choices\n      start\n      end\n      snapshot\n      state\n      scores\n      scores_total\n      author\n      space {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetSpaceQuery(\n    $space: String!\n  ) {\n    space(id: $space) {\n      name\n      about\n      network\n      symbol\n      website\n      private\n      admins\n      moderators\n      members\n      categories\n      plugins\n      children {\n        name\n      }\n      voting {\n        hideAbstain\n      }\n      strategies {\n        name\n        network\n        params\n      }\n      validation {\n        name\n        params\n      }\n      voteValidation {\n        name\n        params\n      }\n      filters {\n        minScore\n        onlyMembers\n      }\n      treasuries {\n        name\n        address\n        network\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetSpaceQuery(\n    $space: String!\n  ) {\n    space(id: $space) {\n      name\n      about\n      network\n      symbol\n      website\n      private\n      admins\n      moderators\n      members\n      categories\n      plugins\n      children {\n        name\n      }\n      voting {\n        hideAbstain\n      }\n      strategies {\n        name\n        network\n        params\n      }\n      validation {\n        name\n        params\n      }\n      voteValidation {\n        name\n        params\n      }\n      filters {\n        minScore\n        onlyMembers\n      }\n      treasuries {\n        name\n        address\n        network\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;