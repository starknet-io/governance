import { useQuery } from "@apollo/client";
import { GET_PROPOSAL_QUERY } from "./queries";
import { transformProposal } from "./helpers";

export function useProposal({ proposal }: { proposal: string | undefined }) {
  // const space = import.meta.env.VITE_APP_SNAPSHOTX_SPACE;
  console.log(proposal);
  const { data, loading, refetch, error } = useQuery(GET_PROPOSAL_QUERY, {
    variables: { id: proposal },
    skip: !proposal,
    context: { clientName: "snapshotX" }, // Adding context to route the query to the second link
  });
  console.log(data);

  const parsedData = data?.proposal ? transformProposal(data?.proposal) : {};
  console.log("proposal: ", parsedData);

  return { data: { proposal: parsedData }, loading, refetch, error };
}
