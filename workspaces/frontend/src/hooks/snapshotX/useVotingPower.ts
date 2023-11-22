import { useQuery } from "@apollo/client";
import { GET_SPACE, GET_VOTING_POWER_QUERY } from "./queries";
import { getVotingPowerCalculation } from "./helpers";

export async function useVotingPower({
  address,
  proposal,
}: {
  address: string;
  proposal?: string;
}) {
  const network = "sn-tn";
  let data = [];
  let isLoading = false;

  const space = import.meta.env.VITE_APP_SNAPSHOTX_SPACE;
  const { data: spaceObj } = useQuery(GET_SPACE, {
    variables: { space },
    skip: !space,
    fetchPolicy: "cache-first",
    context: { clientName: "snapshotX" }, // Adding context to route the query to the second link
  });

  const spaceData = spaceObj?.space;

  if (!address || !address.length || !spaceData) {
    return {
      data: [],
      isLoading: false,
    };
  }

  const strategiesMetadata = spaceData.strategies_parsed_metadata.map(
    (strategy: any) => ({
      ...strategy.data,
    }),
  );

  try {
    data = await getVotingPowerCalculation(
      spaceData.strategies, // strategies
      spaceData.strategies_params,
      strategiesMetadata,
      address,
      1700667132,
    );
  } catch (e) {
    console.warn("Failed to load voting power", e);
    data = [];
  } finally {
    isLoading = false;
  }
  const parsedData = data
    ? data.reduce((acc: bigint, strategy) => {
        let toAdd = strategy.value;
        if (typeof strategy.value === "string") {
          toAdd = parseInt(strategy.value);
        }
        acc += toAdd;
        return acc;
      }, 0n)
    : 0;
  return {
    parsedData,
    isLoading,
  };
}
