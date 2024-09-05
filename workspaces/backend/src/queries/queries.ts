import { gql } from '@apollo/client';

export const GET_PROPOSALS_QUERY = gql`
  query Proposals_Snapshot_X(
    $space: String!
    $orderDirection: OrderDirection!
  ) {
    proposals(
      where: { space: $space, cancelled: false }
      orderDirection: $orderDirection
      orderBy: start
    ) {
      snapshot
      id
      start
      quorum
      created
      author {
        id
      }
      proposal_id
      min_end
      max_end
      scores_total
      scores_1
      scores_2
      scores_3
      completed
      strategies
      vetoed
      executed
      cancelled
      metadata {
        title
        body
        discussion
      }
    }
  }
`;

export const GET_PROPOSAL_QUERY = gql`
  query SnapshotXSingleProposal($space: String!, $proposal_id: String!) {
    proposal(space: $space, proposal_id: $proposal_id) {
      snapshot
      id
      start
      quorum
      created
      author {
        id
      }
      proposal_id
      min_end
      max_end
      scores_total
      scores_1
      scores_2
      scores_3
      completed
      vetoed
      strategies
      executed
      cancelled
      metadata {
        title
        body
        discussion
      }
    }
  }
`;

export const GET_SNAPSHOT_PROPOSALS_QUERY = gql`
  query proposals(
    $space: String!
    $orderDirection: OrderDirection!
    $searchQuery: String = ""
    $first: Int = 20
    $skip: Int = 0
  ) {
    proposals(
      first: $first
      skip: $skip
      orderBy: "created"
      orderDirection: $orderDirection
      where: { space: $space, title_contains: $searchQuery }
    ) {
      id
      title
      choices
      start
      end
      snapshot
      state
      scores
      scores_total
      author
      space {
        id
        name
      }
    }
  }
`;

export const GET_SNAPSHOT_PROPOSAL_QUERY = gql`
  query proposals($space: String!, $id: String!) {
    proposal(where: { space: $space, title_contains: $searchQuery, id: $ids }) {
      id
      title
      choices
      start
      end
      snapshot
      state
      scores
      scores_total
      author
      space {
        id
        name
      }
    }
  }
`;
