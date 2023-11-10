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
