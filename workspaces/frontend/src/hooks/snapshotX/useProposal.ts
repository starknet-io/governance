import { useQuery } from "@apollo/client";
import { GET_PROPOSALS_QUERY } from "./queries";
import {transformProposal } from "./helpers";

export function useProposal({ proposal } : { proposal: string }) {
  const space = import.meta.env.VITE_APP_SNAPSHOTX_SPACE;
  const { data, loading, refetch, error } = useQuery(GET_PROPOSALS_QUERY, {
    variables: { space, proposal },
    skip: !proposal,
    context: { clientName: "snapshotX" }, // Adding context to route the query to the second link
  });

  const parsedData = transformProposal(data?.proposal);
  console.log('proposal: ', parsedData);

  return { data: parsedData, loading, refetch, error };
}
