import { useState } from "react";
import { Contract } from "starknet";
import { starkProvider } from "../../clients/clients";
import { validateStarknetAddress } from "../../utils/helpers";
import { waitForTransaction } from "../snapshotX/helpers";
import { useWallets } from "../useWallets";

const starkContract = import.meta.env.VITE_APP_STRK_CONTRACT;

export const useWrapVSTRK = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const { starknetWallet } = useWallets();

  const wrap = async (starknetAddress: string, amount: number) => {
    setIsSubmitting(true); // Start submitting
    setError(null); // Reset error at the start
    setSuccess(false); // Reset success state

    if (!validateStarknetAddress(starknetAddress)) {
      setError("Invalid StarkNet address");
      setIsSubmitting(false);
      return;
    }

    if (!amount || amount < 0.000001) {
      setError("Amount must be greater than 0.000001");
      setIsSubmitting(false);
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

      const isBraavos = starknetWallet?.connector?.name === "Braavos";

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

      const txResponse = await contract.lock_and_delegate(
        starknetAddress,
        amountWithDecimals,
      );
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
