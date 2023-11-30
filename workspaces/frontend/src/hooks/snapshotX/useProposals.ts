import { useQuery } from "@apollo/client";
import { GET_PROPOSALS_QUERY } from "./queries";
import {transformProposalData} from "./helpers";

export function useProposals() {
  const space = import.meta.env.VITE_APP_SNAPSHOTX_SPACE;
  const { data, loading, refetch, error } = useQuery(GET_PROPOSALS_QUERY, {
    variables: { space },
    context: { clientName: "snapshotX" }, // Adding context to route the query to the second link
  });

  const parsedData = transformProposalData(data);

  return { data: parsedData, loading, refetch, error };
}
