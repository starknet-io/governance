import { useState, useEffect, useContext } from "react";
import { useQuery } from "@apollo/client";
import { GET_SPACE } from "./queries"; // Ensure the import path is correct
import { getVotingPowerCalculation } from "./helpers"; // Ensure the import path is correct
import { VotingPowerContext } from "src/renderer/providers/VotingPowerProvider";
import { ethers } from "ethers";
import { validateStarknetAddress } from "../../utils/helpers";
import { getChecksumAddress } from "starknet"; // Adjust the import path as needed

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
  const [isLoading, setIsLoading] = useState(true);
  const space = import.meta.env.VITE_APP_SNAPSHOTX_SPACE;
  let formattedAddress = undefined;
  if (address && address.length) {
    if (ethers.utils.isAddress(address)) {
      formattedAddress = address?.toLowerCase();
    } else if (validateStarknetAddress(address)) {
      formattedAddress = getChecksumAddress(address);
    }
  }

  const cacheKey = `${formattedAddress}-${proposal}-${timestamp}`;

  const { data: spaceObj, loading: spaceLoading } = useQuery(GET_SPACE, {
    variables: { space },
    skip: !space,
    fetchPolicy: "cache-first",
    context: { clientName: "snapshotX" },
  });

  useEffect(() => {
    async function fetchVotingPower() {
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
    }

    fetchVotingPower();

    // Event listener to re-fetch voting power when relevant events occur
    const refetchOnEvent = () => {
      setVotingPowerData((prevData) => ({}));
    };
    window.addEventListener("delegationSuccess", refetchOnEvent);
    window.addEventListener("wrapSuccess", refetchOnEvent);

    // Cleanup the event listeners
    return () => {
      window.removeEventListener("delegationSuccess", refetchOnEvent);
      window.removeEventListener("wrapSuccess", refetchOnEvent);
    };
  }, [
    address,
    proposal,
    timestamp,
    spaceObj,
    spaceLoading,
    setVotingPowerData,
    votingPowerData?.[cacheKey],
  ]);

  return {
    data: votingPowerData[cacheKey] ? votingPowerData[cacheKey].votingPower : 0,
    isLoading: isLoading || spaceLoading,
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
