import { useState } from "react";
import { Contract } from "starknet";
import { starkProvider } from "../../clients/clients";
import { validateStarknetAddress } from "../../utils/helpers";
import { waitForTransaction } from "../snapshotX/helpers";
import { useWallets } from "../useWallets";

const starkContract = import.meta.env.VITE_APP_VSTRK_CONTRACT;

export const useUnwrapVSTRK = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);

  const { starknetWallet } = useWallets();

  const isBraavos = starknetWallet?.connector?.name === "Braavos";

  const unwrap = async (starknetAddress: string, amount: number) => {
    if (!validateStarknetAddress(starknetAddress)) {
      setError("Invalid StarkNet address");
      return;
    }

    if (!amount || amount < 0.000001) {
      setError("Amount must be greater than 0.000001");
      return;
    }

    if (!window.starknet) {
      return "Starknet not found";
    }

    setIsSubmitting(true);
    setSuccess(false);
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

      const starknetObject = isBraavos
        ? window.starknet_braavos
        : window.starknet;

      if (!starknetObject) {
        return;
      }

      await starknetObject.enable();

      const account = starknetObject.account;
      contract.connect(account);

      const amountWithDecimals = BigInt(Math.floor(amount * 1e18)).toString(); // Convert to string to avoid precision issues

      const txResponse = await contract.unlock(amountWithDecimals);
      setTransactionHash(txResponse.transaction_hash);
      await waitForTransaction(txResponse.transaction_hash);
      setSuccess(true);
    } catch (err) {
      setError(err);
      setTransactionHash(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { unwrap, loading: isSubmitting, error, transactionHash, success };
};
