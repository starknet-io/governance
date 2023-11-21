import { useQuery } from "@apollo/client";
import { GET_VOTES_QUERY } from "./queries";
import { transformVotes } from "./helpers";

type SkippableField = "voter" | "proposal";

export function useVotes({
  voter,
  proposal,
  space,
  skipField,
}: {
  voter?: string;
  proposal?: string;
  space?: string;
  skipField?: SkippableField;
}) {
  const selectedSpace = space || import.meta.env.VITE_APP_SNAPSHOTX_SPACE;
  const variables = {
    where: {
      ...(voter ? { voter } : {}),
      ...(selectedSpace ? { space: selectedSpace } : {}),
      ...(proposal ? { proposal: parseInt(proposal) } : {}),
    },
  };
  let toSkip = null;
  if (skipField === "voter") {
    toSkip = voter;
  } else if (skipField === "proposal") {
    toSkip = proposal;
  }
  const { data, loading, refetch, error } = useQuery(GET_VOTES_QUERY, {
    variables,
    skip: !toSkip || !toSkip.length,
    context: { clientName: "snapshotX" }, // Adding context to route the query to the second link
  });

  const transformedVotes = transformVotes(data);

  return { data: { votes: transformedVotes }, loading, refetch, error };
}
