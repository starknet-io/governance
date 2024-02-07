import { useState } from "react";
import { Contract } from "starknet";
import { starkProvider } from "../../clients/clients";
import { validateStarknetAddress } from "../../utils/helpers";
import { waitForTransaction } from "../snapshotX/helpers";

const starkContract = import.meta.env.VITE_APP_STRK_CONTRACT;

export const useWrapVSTRK = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);

  const wrap = async (starknetAddress: string, amount: number) => {
    setIsSubmitting(true); // Start submitting
    setError(null); // Reset error at the start
    setSuccess(false); // Reset success state

    if (!validateStarknetAddress(starknetAddress)) {
      setError("Invalid StarkNet address");
      setIsSubmitting(false)
      return;
    }

    if (!amount || amount < 1) {
      setError("Amount must be greater than 0");
      setIsSubmitting(false)
      return;
    }

    if (!window.starknet) {
      return "Starknet not found";
    }

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

      const amountWithDecimals = BigInt(amount) * 1000000000000000000n

      const txResponse = await contract.lock_and_delegate(starknetAddress, amountWithDecimals);
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

  return { wrap, loading: isSubmitting, error, transactionHash, success };
};
