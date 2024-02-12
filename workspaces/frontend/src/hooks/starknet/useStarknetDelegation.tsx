import { useState } from "react";
import { Contract } from "starknet";
import { starkProvider } from "../../clients/clients";
import { validateStarknetAddress } from "../../utils/helpers";
import { waitForTransaction } from "../snapshotX/helpers";
import { useWallets } from "../useWallets";

const starkContract = import.meta.env.VITE_APP_VSTRK_CONTRACT;

export const useStarknetDelegate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);

  const { starknetWallet } = useWallets();

  const isBraavos = starknetWallet?.connector?.name === "Braavos";

  const delegate = async (
    starknetAddress: string,
    delegateToAddress: string,
  ) => {
    if (
      !validateStarknetAddress(starknetAddress) ||
      !validateStarknetAddress(delegateToAddress)
    ) {
      setError("Invalid StarkNet address");
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

      const txResponse = await contract.delegate(delegateToAddress);
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

  return { delegate, loading: isSubmitting, error, transactionHash, success };
};
