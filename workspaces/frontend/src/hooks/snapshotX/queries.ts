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
    space(
      id: $space
    ) {
      id
      vote_count
      voting_power_validation_strategies_parsed_metadata {
        data {
          name
          symbol
          payload
        }
      }
      authenticators
      strategies
      strategies_params
      validation_strategy
      strategies_indicies
      strategies_metadata
      strategies_parsed_metadata {
        data {
          id
        }
      }
      authenticators
      metadata {
        delegation_api_type
        delegation_contract
        delegation_api_url
        voting_power_symbol
      }
      strategies
      validation_strategy
      validation_strategy_params
      strategies_params
      strategies_parsed_metadata {
        data {
          symbol
          payload
        }
      }
      voting_power_validation_strategy_strategies
      voting_power_validation_strategy_strategies_params
    }
  }
`;
