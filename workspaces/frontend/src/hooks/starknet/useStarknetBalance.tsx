import { useEffect } from "react";
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
  const { balances, setBalances, loading, setLoading, error, setError } =
    useBalance();
  // Generate a unique cache key
  const cacheKey = `${starkContract}-${getChecksumAddress(
    starknetAddress || "",
  )}`;

  useEffect(() => {
    const fetchBalance = async () => {
      console.log("i am here", starknetAddress, starkContract);
      if (!starknetAddress || !validateStarknetAddress(starknetAddress)) {
        setBalances((prevBalances) => ({
          ...prevBalances,
          [cacheKey]: null,
        }));
        return;
      }

      // Check if the balance for the cacheKey already exists
      if (balances[cacheKey]) {
        return;
      }
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
        const decimals = 18;
        const symbol = await contract.symbol();
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
        setLoading(false);
      }
    };

    fetchBalance();

    const onWrapSuccess = () => {
      setBalances((prevBalances: any) => ({}));
    };

    window.addEventListener("wrapSuccess", onWrapSuccess);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("wrapSuccess", onWrapSuccess);
    };
  }, [
    starknetAddress,
    starkContract,
    setBalances,
    setLoading,
    setError,
    balances?.[cacheKey],
  ]);

  return { balance: balances?.[cacheKey], loading, error, cacheKey };
};
