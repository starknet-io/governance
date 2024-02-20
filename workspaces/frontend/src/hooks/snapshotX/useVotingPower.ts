import { useState, useEffect, useContext } from "react";
import { useQuery } from "@apollo/client";
import { GET_SPACE } from "./queries"; // Adjust the import path as needed
import { getVotingPowerCalculation } from "./helpers"; // Ensure paths are correct
import { VotingPowerContext } from "src/renderer/providers/VotingPowerProvider";
// Adjust the import path as needed

export function useVotingPower({
  address,
  proposal,
  timestamp,
}: {
  address: string;
  proposal?: number;
  timestamp?: number;
}) {
  const { votingPowerData, setVotingPowerData } =
    useContext(VotingPowerContext);
  const [isLoading, setIsLoading] = useState(true); // Correctly define local isLoading state
  const space = import.meta.env.VITE_APP_SNAPSHOTX_SPACE;
  const cacheKey = `${address}-${proposal}-${timestamp}`;

  const { data: spaceObj, loading: spaceLoading } = useQuery(GET_SPACE, {
    variables: { space },
    skip: !space,
    fetchPolicy: "cache-first",
    context: { clientName: "snapshotX" },
  });

  useEffect(() => {
    const fetchVotingPower = async () => {
      // Check if data for this address (and optionally proposal and timestamp) already exists
      if (votingPowerData[cacheKey] || !address || !spaceObj?.space) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const strategiesMetadata = processStrategiesMetadata(
          spaceObj.space.strategies_parsed_metadata,
          spaceObj.space.strategies_indicies,
        );

        const vpData = await getVotingPowerCalculation(
          spaceObj.space.strategies,
          spaceObj.space.strategies_params,
          strategiesMetadata,
          address,
          timestamp,
        );

        const maxDecimals = Math.max(
          ...vpData.map((strategy) => strategy.decimals),
        );
        const totalRawValue = vpData.reduce((acc, strategy) => {
          const valueBigInt = BigInt(strategy.value);
          const scaleFactor = BigInt(10 ** (maxDecimals - strategy.decimals));
          return (
            acc +
            (strategy.symbol === "Whitelist"
              ? valueBigInt
              : valueBigInt * scaleFactor)
          );
        }, 0n);

        const scaledValue =
          parseFloat(totalRawValue.toString()) / Math.pow(10, maxDecimals);
        const finalValue =
          scaledValue > 1
            ? Math.round(scaledValue)
            : parseFloat(scaledValue.toFixed(4));

        // Update the global state with new voting power data
        setVotingPowerData((prevData) => ({
          ...prevData,
          [cacheKey]: {
            votingPower: finalValue,
            isLoading: false,
          },
        }));
      } catch (e) {
        console.error("Failed to load voting power", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVotingPower();
  }, [
    address,
    proposal,
    timestamp,
    spaceObj,
    spaceLoading,
    setVotingPowerData,
    votingPowerData,
    cacheKey,
  ]);

  // Determine if we're currently loading based on both the local loading state and the spaceLoading state
  const currentlyLoading = isLoading || spaceLoading;
  // Attempt to use cached data first; if unavailable, default to 0
  const data = votingPowerData[cacheKey]
    ? votingPowerData[cacheKey].votingPower
    : 0;

  return {
    data,
    isLoading: currentlyLoading,
  };
}

function processStrategiesMetadata(
  parsedMetadata: any[],
  strategiesIndicies?: number[],
) {
  if (parsedMetadata.length === 0) return [];

  const maxIndex = Math.max(
    ...parsedMetadata.map((metadata) => metadata.index),
  );

  const metadataMap = Object.fromEntries(
    parsedMetadata.map((metadata) => [
      metadata.index,
      {
        name: metadata.data.name,
        description: metadata.data.description,
        decimals: metadata.data.decimals,
        symbol: metadata.data.symbol,
        token: metadata.data.token,
        payload: metadata.data.payload,
      },
    ]),
  );

  strategiesIndicies =
    strategiesIndicies || Array.from(Array(maxIndex + 1).keys());
  return strategiesIndicies.map((index) => metadataMap[index]) || [];
}
