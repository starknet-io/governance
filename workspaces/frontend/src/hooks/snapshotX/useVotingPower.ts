import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_SPACE } from "./queries";
import {getVotingPowerCalculation, parseVotingPowerInDecimals} from "./helpers";

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
          timestamp ? timestamp : null,
        );
        //console.log(vpData)
        const parsedData = vpData.reduce((acc: any, strategy: any) => {
          const valueWithDecimals = BigInt(strategy.value) / BigInt(10 ** strategy.decimals);
          acc += valueWithDecimals;
          return acc;
        }, 0n);
        //console.log(parsedData)
        //const formattedData = parseVotingPowerInDecimals(parsedData)
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
