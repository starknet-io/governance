import { useQuery } from "@apollo/client";
import { GET_OLD_VOTES_QUERY } from "./queries";

type SkippableField = "voter" | "proposal";

export function useOldVotes({
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
  const selectedSpace = space || import.meta.env.VITE_APP_SNAPSHOT_SPACE;
  const variables = {
    where: {
      ...(voter ? { voter } : {}),
      ...(selectedSpace ? { space: selectedSpace } : {}),
      ...(proposal ? { proposal } : {}),
    },
  };
  let toSkip = null;
  if (skipField === "voter") {
    toSkip = voter;
  } else if (skipField === "proposal") {
    toSkip = proposal;
  }
  const { data, loading, refetch, error } = useQuery(GET_OLD_VOTES_QUERY, {
    variables,
    skip: !toSkip || !toSkip?.toString()?.length,
  });

  return { data: { votes: data?.votes || [] }, loading, refetch, error };
}
