import { gql } from '@apollo/client';

export const GET_PROPOSALS_QUERY = gql`
  query Proposals_Snapshot_X(
    $space: String!
  ) {
    proposals(
      where: {
        space: $space
      }
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
  query SnapshotXSingleProposal(
    $space: String!
    $proposal_id: String!
  ) {
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
