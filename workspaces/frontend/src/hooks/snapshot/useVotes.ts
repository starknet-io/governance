import { useQuery } from "@apollo/client";
import { GET_VOTES_QUERY } from "./queries";

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
  const variables = {
    where: {
      ...(voter ? { voter } : {}),
      ...(space ? { space } : {}),
      ...(proposal ? { proposal } : {}),
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
    fetchPolicy: "cache-and-network",
  });

  return { data, loading, refetch, error };
}
