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
