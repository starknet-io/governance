import { useQuery } from "@apollo/client";
import { GET_VOTES_QUERY } from "./queries";

export function useVotes({
  voter,
  proposal,
}: {
  voter: string;
  proposal: string;
}) {
  const variables = {
    where: {
      voter,
      ...(proposal ? { proposal } : {}),
    },
  };
  console.log(variables);
  const { data, loading, refetch, error } = useQuery(GET_VOTES_QUERY, {
    variables,
    skip: !voter,
    fetchPolicy: "cache-and-network",
  });

  return { data, loading, refetch, error };
}
