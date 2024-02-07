import { useState } from "react";
import { Contract } from "starknet";
import { starkProvider } from "../../clients/clients";
import { validateStarknetAddress } from "../../utils/helpers";
import { waitForTransaction } from "../snapshotX/helpers";

const starkContract = import.meta.env.VITE_APP_VSTRK_CONTRACT;

export const useWrapVSTRK = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);

  const unwrap = async (starknetAddress: string, amount: number) => {
    if (!validateStarknetAddress(starknetAddress)) {
      setError("Invalid StarkNet address");
      return;
    }

    if (!amount || amount < 10) {
      setError("Amount must be greater than 0");
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

      await window.starknet.enable();

      const account = window.starknet.account;
      contract.connect(account);

      const txResponse = await contract.unlock(amount);
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
