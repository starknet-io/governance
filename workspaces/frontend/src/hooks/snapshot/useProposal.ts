import { useQuery } from "@apollo/client";
import { GET_PROPOSAL_QUERY } from "./queries";

export function useProposal({ proposal }: { proposal: string }) {
  const { data, loading, refetch, error } = useQuery(GET_PROPOSAL_QUERY, {
    variables: { proposal: proposal },
    skip: !proposal,
  });

  return { data, loading, refetch, error };
}
