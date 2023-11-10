// src/gql/queries.ts
import { gql } from "@apollo/client";

export const GET_VOTING_POWER_QUERY = gql`
  query Vp($voter: String!, $space: String!, $proposal: String) {
    vp(voter: $voter, space: $space, proposal: $proposal) {
      vp
      vp_by_strategy
      vp_state
    }
  }
`;

export const GET_SPACE_QUERY = gql(`
  query GetSpaceQuery(
    $space: String!
  ) {
    space(id: $space) {
      name
      about
      network
      symbol
      website
      private
      admins
      moderators
      members
      categories
      plugins
      children {
        name
      }
      voting {
        hideAbstain
      }
      strategies {
        name
        network
        params
      }
      validation {
        name
        params
      }
      voteValidation {
        name
        params
      }
      filters {
        minScore
        onlyMembers
      }
      treasuries {
        name
        address
        network
      }
    }
  }
`);

export const GET_VOTES_QUERY = gql(`
  query VoteQuery($where: VoteWhere) {
    votes(where: $where) {
      choice
      voter
      reason
      metadata
      proposal {
        id
        title
        body
        choices
      }
      created
      ipfs
      vp
      vp_by_strategy
      vp_state
    }
  }
`);

export const GET_PROPOSAL_QUERY = gql`
  query Proposal($proposal: String!) {
    proposal(id: $proposal) {
      id
      author
      title
      body
      choices
      votes
      scores
      start
      end
      state
      discussion
      ipfs
      type
      scores_by_strategy
      scores_state
      scores_total
      scores_updated
      snapshot
      strategies {
        network
        params
      }
    }
  }
`;

export const GET_PROPOSALS_QUERY = gql(`
  query Proposals($space: String!) {
    proposals(first: 20, skip: 0, where: {space_in: [$space]}, orderBy: "created", orderDirection: desc) {
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
`);
