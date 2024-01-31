import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_SPACE } from "./queries";
import { getVotingPowerCalculation } from "./helpers";

export function useVotingPower({ address, proposal, timestamp }: {
  address: string,
  proposal?: number,
  timestamp?: number,
}) {
  const space = import.meta.env.VITE_APP_SNAPSHOTX_SPACE;

  const [data, setData] = useState(0n);
  const [isLoading, setIsLoading] = useState(true);

  const { data: spaceObj, loading: spaceLoading } = useQuery(GET_SPACE, {
    variables: { space },
    skip: !space,
    fetchPolicy: "cache-first",
    context: { clientName: "snapshotX" },
  });

  const fetchVotingPower = async () => {
    if (!address || !spaceObj?.space || !address.length) {
      setData(0n);
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

      const parsedData = vpData.reduce((acc, strategy) => {
        const valueWithDecimals = BigInt(strategy.value) / BigInt(10 ** strategy.decimals);
        acc += valueWithDecimals;
        return acc;
      }, 0n);

      setData(parsedData);
    } catch (e) {
      console.warn("Failed to load voting power", e);
      setData(0n);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVotingPower();

    // Event listener to re-fetch voting power when delegation is successful
    const onDelegationSuccess = () => {
      fetchVotingPower();
    };

    window.addEventListener("delegationSuccess", onDelegationSuccess);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("delegationSuccess", onDelegationSuccess);
    };
  }, [address, spaceObj, timestamp]);

  return {
    data,
    isLoading: isLoading || spaceLoading,
  };
}
