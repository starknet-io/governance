import { gql } from "@apollo/client";

export const GET_PROPOSALS_QUERY = gql`
  query ProposalsSnapshotX($space: String!) {
    proposals(where: { space_in: [$space] }) {
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
  query SnapshotXSingleProposal($id: String!) {
    proposal(id: $id) {
      snapshot
      id
      start
      quorum
      created
      tx
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
      strategies_indicies
      vetoed
      executed
      cancelled
      strategies
      tx
      metadata {
        id
        title
        body
        discussion
      }
      vote_count
    }
  }
`;

export const GET_VOTES_QUERY = gql(`
  query VoteQuery($where: Vote_filter, $first: Int = 50) {
    votes(where: $where, first: $first) {
      choice
      proposal
      tx
      voter {
        id
      }
      created
      vp
    }
  }
`);

export const GET_VOTING_POWER_QUERY = gql`
  query Vp($voter: String!, $space: String!, $proposal: String) {
    vp(voter: $voter, space: $space, proposal: $proposal) {
      vp
      vp_by_strategy
      vp_state
    }
  }
`;

export const GET_SPACE = gql`
  query spaceQuery($space: String!) {
    space(id: $space) {
      id
      vote_count
      voting_power_validation_strategies_parsed_metadata {
        data {
          name
          symbol
          payload
          decimals
          token
        }
      }
      authenticators
      strategies_indicies
      strategies_metadata
      authenticators
      metadata {
        voting_power_symbol
      }
      strategies
      validation_strategy
      validation_strategy_params
      strategies_params
      strategies_parsed_metadata {
        data {
          symbol
          name
          decimals
          payload
          token
        }
        index
      }
      voting_power_validation_strategy_strategies
      voting_power_validation_strategy_strategies_params
    }
  }
`;

export const GET_SNAPSHOT_PROPOSAL_QUERY = gql`
  query SnapshotProposal($id: String!) {
    proposal(id: $id) {
      id
      title
      body
      choices
      start
      end
      snapshot
      ipfs
      state
      strategies {
        name
        network
        params
      }
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

export const GET_OLD_VOTES_QUERY = gql`
  query VoteQuery($where: VoteWhere) {
    votes(where: $where) {
      choice
      voter
      reason
      metadata
      created
      ipfs
      vp
      vp_by_strategy
      vp_state
    }
  }
`;
