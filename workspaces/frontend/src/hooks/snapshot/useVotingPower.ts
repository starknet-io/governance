import { useQuery } from "@apollo/client";
import { GET_VOTING_POWER_QUERY } from "./queries";

export function useVotingPower({
  voter,
  proposal,
}: {
  voter: string;
  proposal?: string;
}) {
  const space = import.meta.env.VITE_APP_SNAPSHOT_SPACE;
  const variables = {
    voter,
    space,
    ...(proposal ? { proposal } : {}),
  };

  const { data, loading, refetch, error } = useQuery(GET_VOTING_POWER_QUERY, {
    variables,
    skip: !voter,
    fetchPolicy: "cache-and-network",
  });

  return { data, loading, refetch, error };
}
