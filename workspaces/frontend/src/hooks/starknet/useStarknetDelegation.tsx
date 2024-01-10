import { useState } from "react";
import { Contract } from "starknet";
import { starkProvider } from "../../clients/clients";
import { validateStarknetAddress } from "../../utils/helpers";
import {waitForTransaction} from "../snapshotX/helpers";

const starkContract =
  "0x05936cbb910e8f16a670e26f1ae3d91925be439b597b4e5e5b0c674ddd7149fa";

export const useStarknetDelegate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);

  const delegate = async (starknetAddress: string, delegateToAddress: string) => {
    if (!validateStarknetAddress(starknetAddress) || !validateStarknetAddress(delegateToAddress)) {
      setError("Invalid StarkNet address");
      return;
    }

    if (!window.starknet) {
      return "Starknet not found"
    }

    setIsSubmitting(true);
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
      contract.connect(account)

      const txResponse = await contract.delegate(delegateToAddress);
      setTransactionHash(txResponse.transaction_hash);
      await waitForTransaction(txResponse.transaction_hash)
      setSuccess(true)
    } catch (err) {
      setError(err);
      setTransactionHash(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { delegate, loading: isSubmitting, error, transactionHash, success };
};
