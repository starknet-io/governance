import { useQuery } from "@apollo/client";
import { GET_PROPOSALS_QUERY } from "./queries";

export function useProposals() {
  const space = import.meta.env.VITE_APP_SNAPSHOT_SPACE;
  const { data, loading, refetch, error } = useQuery(GET_PROPOSALS_QUERY, {
    variables: { space },
  });

  return { data, loading, refetch, error };
}
