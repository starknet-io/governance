import { useQuery } from "@apollo/client";
import { GET_SNAPSHOT_PROPOSAL_QUERY } from "./queries";

export function useOldProposal({ proposal }: { proposal: string | undefined }) {
  // const space = import.meta.env.VITE_APP_SNAPSHOTX_SPACE;
  const { data, loading, refetch, error } = useQuery(
    GET_SNAPSHOT_PROPOSAL_QUERY,
    {
      variables: { id: proposal },
      skip: !proposal,
    },
  );

  const parsedData = data?.proposal;

  return { data: { proposal: parsedData }, loading, refetch, error };
}
