import { useEffect, useRef } from "react";
import { BigNumber, ethers } from "ethers";
import { Contract, getChecksumAddress } from "starknet";
import { starkProvider } from "../../clients/clients";
import { validateStarknetAddress } from "../../utils/helpers";
import { hexToString } from "viem";
import {
  useBalance,
  BalanceInfo,
} from "src/renderer/providers/BalanceProvider";

const starknetContract = import.meta.env.VITE_APP_VSTRK_CONTRACT as string;

interface UseStarknetBalanceProps {
  starknetAddress: string;
  starkContract?: string;
}

export const useStarknetBalance = ({
  starknetAddress,
  starkContract = starknetContract,
}: UseStarknetBalanceProps) => {
  const hasEventListener = useRef(false);

  const {
    balances,
    setBalances,
    loading,
    setLoading,
    error,
    setError,
    isFetching,
    setCount,
  } = useBalance();
  // Generate a unique cache key
  const cacheKey = `${starkContract}-${getChecksumAddress(
    starknetAddress || "",
  )}`;

  useEffect(() => {
    const fetchBalance = async () => {
      if (
        !starknetAddress ||
        !starknetAddress.length ||
        !validateStarknetAddress(starknetAddress)
      ) {
        setBalances((prevBalances) => ({
          ...prevBalances,
          [cacheKey]: null,
        }));
        return;
      }

      // Check if the balance for the cacheKey already exists or is loading
      if (balances[cacheKey] || isFetching[cacheKey]) {
        return;
      }

      isFetching[cacheKey] = true;
      setLoading(true);
      setError(null);
      try {
        const provider = starkProvider;
        const contractAddress = starkContract;
        const { abi: starknetContractAbi } =
          await starkProvider.getClassAt(contractAddress);

        const contract = new Contract(
          starknetContractAbi,
          contractAddress,
          provider,
        );
        const rawBalance = await contract.balance_of(starknetAddress);
        const decimals = 18n;
        const symbol =
          starkContract === starknetContract ? "0x765354524b" : "0x5354524b";
        const hex = BigNumber.from(symbol).toHexString();
        const symbolString = hexToString(hex as `0x${string}`);
        const formattedBalance = ethers.utils.formatUnits(rawBalance, decimals);
        const commifiedBalance = ethers.utils.commify(formattedBalance);

        setBalances((prevBalances: any) => ({
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
        isFetching[cacheKey] = false;
        setLoading(false);
      }
    };

    fetchBalance();

    const onWrapSuccess = () => {
      setBalances((prevBalances: any) => ({}));
    };

    if (!hasEventListener.current) {
      window.addEventListener("wrapSuccess", onWrapSuccess);
      hasEventListener.current = true;
    }

    // Cleanup the event listener
    return () => {
      if (hasEventListener.current) {
        window.removeEventListener("wrapSuccess", onWrapSuccess);
        hasEventListener.current = false;
      }
    };
  }, [starknetAddress, starkContract, balances?.[cacheKey]]);

  return { balance: balances?.[cacheKey], loading, error, cacheKey };
};
