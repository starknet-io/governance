import { useQuery } from "@apollo/client";
import { GET_SPACE_QUERY } from "./queries";

export function useSpace() {
  const space = import.meta.env.VITE_APP_SNAPSHOT_SPACE;
  const { data, loading, refetch, error } = useQuery(GET_SPACE_QUERY, {
    variables: { space: space },
  });

  return { data, loading, refetch, error };
}
