import { gql } from "@apollo/client";

export const GET_PROPOSALS_QUERY = gql`
  query ProposalsSnapshotX($space: String!) {
    proposals(
      where: {
        space_in: [$space]
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
    $id: String!
  ) {
    proposal(id: $id) {
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

export const GET_VOTES_QUERY = gql(`
  query VoteQuery($where: Vote_filter) {
    votes(where: $where) {
      choice
      voter {
        id
      }
      created
      vp
    }
  }
`);


