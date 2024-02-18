import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_SPACE } from "./queries";
import { getVotingPowerCalculation } from "./helpers";

export function useVotingPower({
  address,
  proposal,
  timestamp,
}: {
  address: string;
  proposal?: number;
  timestamp?: number;
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

  const fetchVotingPower = async () => {
    if (!address || !spaceObj?.space || !address.length) {
      setData(0n);
      setIsLoading(false);
      return;
    }

    const strategiesMetadata = processStrategiesMetadata(
      spaceObj.space.strategies_parsed_metadata,
      spaceObj.space.strategies_indicies,
    );
    try {
      const vpData = await getVotingPowerCalculation(
        spaceObj.space.strategies,
        spaceObj.space.strategies_params,
        strategiesMetadata,
        address,
        timestamp ? timestamp : null,
      );
      const maxDecimals = Math.max(
        ...vpData.map((strategy) => strategy.decimals),
      );
      const totalRawValue = vpData.reduce((acc, strategy) => {
        const valueBigInt = BigInt(strategy.value);
        if (strategy.symbol === "Whitelist") {
          return acc + valueBigInt;
        }
        const scaleFactor = BigInt(10 ** (maxDecimals - strategy.decimals));
        return acc + valueBigInt * scaleFactor;
      }, 0n);

      const scaledValue =
        parseFloat(totalRawValue.toString()) / Math.pow(10, maxDecimals);
      if (scaledValue > 1) {
        setData(Math.round(scaledValue));
      } else {
        const fixedTo4Digits = parseFloat(scaledValue.toFixed(4))
        setData(fixedTo4Digits);
      }
      setData(scaledValue);
      console.log(scaledValue);
    } catch (e) {
      console.error("Failed to load voting power", e);
      setData(0);
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
    window.addEventListener("wrapSuccess", onDelegationSuccess);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("delegationSuccess", onDelegationSuccess);
      window.removeEventListener("wrapSuccess", onDelegationSuccess);
    };
  }, [address, spaceObj, timestamp]);

  return {
    data,
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
