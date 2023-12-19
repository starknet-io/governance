import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_SPACE } from "./queries";
import { getVotingPowerCalculation } from "./helpers";

export function useVotingPower({
  address,
  proposal,
  timestamp,
}: {
  address?: string | null;
  proposal?: string;
  timestamp?: number | null;
}) {
  const space = import.meta.env.VITE_APP_SNAPSHOTX_SPACE;

  const [data, setData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { data: spaceObj, loading: spaceLoading } = useQuery(GET_SPACE, {
    variables: { space },
    skip: !space,
    fetchPolicy: "cache-first",
    context: { clientName: "snapshotX" },
  });

  useEffect(() => {
    async function fetchVotingPower() {
      if (!address || !spaceObj?.space) {
        setData(0);
        setIsLoading(false);
        return;
      }

      const strategiesMetadata = spaceObj.space.strategies_parsed_metadata.map(
        (strategy) => ({
          ...strategy.data,
        }),
      );

      try {
        const vpData = await getVotingPowerCalculation(
          spaceObj.space.strategies,
          spaceObj.space.strategies_params,
          strategiesMetadata,
          address,
          timestamp ? timestamp : Math.floor(Date.now() / 1000),
        );
        console.log(vpData)
        const parsedData = vpData
          ? vpData.reduce((acc, strategy) => {
              let toAdd = BigInt(strategy.value);
              acc += toAdd;
              return acc;
            }, 0n)
          : 0n;
        setData(parsedData);
      } catch (e) {
        console.warn("Failed to load voting power", e);
        setData(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVotingPower();
  }, [address, spaceObj, timestamp]);

  return {
    data,
    isLoading: isLoading || spaceLoading,
  };
}
