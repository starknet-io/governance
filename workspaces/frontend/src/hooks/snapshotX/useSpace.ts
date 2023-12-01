import { useQuery } from "@apollo/client";
import { GET_SPACE } from "./queries";

export function useSpace() {
  const space = import.meta.env.VITE_APP_SNAPSHOTX_SPACE;
  const { data, loading, refetch, error } = useQuery(GET_SPACE, {
    variables: { space },
    skip: !space,
    context: { clientName: "snapshotX" }, // Adding context to route the query to the second link
  });

  return { data: data?.space, loading, refetch, error };
}
