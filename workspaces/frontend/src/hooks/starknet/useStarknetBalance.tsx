import { useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import { Contract } from "starknet";
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
  const { balance, setBalance, loading, setLoading, error, setError } =
    useBalance();

  useEffect(() => {
    const fetchBalance = async () => {
      if (!starknetAddress) {
        setBalance(null);
        return;
      }

      const isValidAddress = validateStarknetAddress(starknetAddress);
      if (!isValidAddress) {
        setBalance(null);
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
        const decimals = await contract.decimals();
        const symbol = await contract.symbol();
        const hex = BigNumber.from(symbol).toHexString();
        const symbolString = hexToString(hex as `0x${string}`);
        const formattedBalance = ethers.utils.formatUnits(rawBalance, decimals);
        const commifiedBalance = ethers.utils.commify(formattedBalance);

        setBalance({
          balance: commifiedBalance,
          rawBalance: formattedBalance,
          decimals,
          symbol: symbolString,
          address: starknetAddress,
        } as BalanceInfo);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (!balance) {
      fetchBalance();
    }

    const onWrapSuccess = () => {
      fetchBalance();
    };

    window.addEventListener("wrapSuccess", onWrapSuccess);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("wrapSuccess", onWrapSuccess);
    };
  }, [starknetAddress, setBalance, setLoading, setError, balance]);

  return { balance, loading, error };
};
