// useStarknetBalance.js

import { useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import { getChecksumAddress, Contract } from "starknet";
import { starkProvider } from "../../clients/clients";
import { validateStarknetAddress } from "../../utils/helpers";
import { hexToString } from "viem";
import { useBalance } from "src/renderer/providers/BalanceProvider";

const starknetContract = import.meta.env.VITE_APP_VSTRK_CONTRACT as string;

interface UseStarknetBalanceProps {
  starknetAddress: string;
  starkContract?: string;
  totalSupply?: boolean;
}

export const useStarknetBalance = ({
  starknetAddress,
  starkContract = starknetContract,
  totalSupply = false,
}: UseStarknetBalanceProps) => {
  const {
    balances,
    setBalances,
    loading,
    setLoading,
    error,
    setError,
    addActiveCacheKey,
    removeActiveCacheKey,
    isFetching,
  } = useBalance();

  const cacheKey = `${starkContract}-${getChecksumAddress(
    starknetAddress || "",
  )}-${totalSupply}`;

  const fetchBalance = async (forceUpdate = false) => {
    if (
      ((!starknetAddress || !validateStarknetAddress(starknetAddress)) &&
        !totalSupply) ||
      balances[cacheKey] ||
      isFetching[cacheKey]
    ) {
      if (!forceUpdate) {
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      isFetching[cacheKey] = true;
      const provider = starkProvider;
      const contractAddress = starkContract;
      const { abi: starknetContractAbi } =
        await provider.getClassAt(contractAddress);
      const contract = new Contract(
        starknetContractAbi,
        contractAddress,
        provider,
      );
      const rawBalance = totalSupply
        ? await contract.totalSupply()
        : await contract.balance_of(starknetAddress);
      const decimals = 18n;
      const symbol =
        starkContract === starknetContract ? "0x765354524b" : "0x5354524B";
      const hex = BigNumber.from(symbol).toHexString();
      const symbolString = hexToString(hex as `0x${string}`);
      const formattedBalance = ethers.utils.formatUnits(rawBalance, decimals);
      const commifiedBalance = ethers.utils.commify(formattedBalance);

      setBalances((prevBalances) => ({
        ...prevBalances,
        [cacheKey]: {
          balance: commifiedBalance,
          rawBalance: formattedBalance,
          decimals,
          symbol: symbolString,
          address: starknetAddress,
        },
      }));
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
      isFetching[cacheKey] = false;
    }
  };

  useEffect(() => {
    const isNewKey = addActiveCacheKey(cacheKey);
    if (isNewKey) {
      const onWrapSuccess = () => {
        fetchBalance(true);
      };
      window.addEventListener("wrapSuccess", onWrapSuccess);

      return () => {
        window.removeEventListener("wrapSuccess", onWrapSuccess);
        removeActiveCacheKey(cacheKey);
      };
    }
  }, [starknetAddress, starkContract, cacheKey, totalSupply]);

  useEffect(() => {
    fetchBalance();
  }, [cacheKey]);

  return { balance: balances[cacheKey], loading, error, cacheKey };
};
