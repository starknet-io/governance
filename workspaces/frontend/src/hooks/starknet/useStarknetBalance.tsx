import { useState, useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import { Contract } from "starknet";
import { starkProvider } from "../../clients/clients";
import { validateStarknetAddress } from "../../utils/helpers";
import { hexToString } from "viem";

const starkContract =
  "0x05936cbb910e8f16a670e26f1ae3d91925be439b597b4e5e5b0c674ddd7149fa";

export const useStarknetBalance = ({
  starknetAddress,
}: {
  starknetAddress: string;
}) => {
  const [balance, setBalance] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        // Replace with actual StarkNet provider and contract address/ABI
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
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [starknetAddress]);

  return { balance, loading, error };
};
