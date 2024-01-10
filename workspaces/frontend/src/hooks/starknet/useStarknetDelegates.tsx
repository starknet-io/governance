import { useState, useEffect } from "react";
import { Contract } from "starknet";
import { starkProvider } from "../../clients/clients";
import { validateStarknetAddress } from "../../utils/helpers";
import {BigNumber} from "ethers";
import {hexToString} from "viem";

const starkContract =
  "0x05936cbb910e8f16a670e26f1ae3d91925be439b597b4e5e5b0c674ddd7149fa";

export const useStarknetDelegates = ({
  starknetAddress,
}: {
  starknetAddress: string;
}) => {
  const [delegates, setDelegates] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDelegates = async () => {
      if (!starknetAddress) {
        setDelegates(null);
        return;
      }

      const isValidAddress = validateStarknetAddress(starknetAddress);
      if (!isValidAddress) {
        setDelegates(null);
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

        // Assuming 'delegates_of' is the method name; replace with the actual method name
        const delegatesData = await contract.delegates(starknetAddress);
        const delegate = BigNumber.from(delegatesData).toHexString();
        setDelegates(delegate);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDelegates();
  }, [starknetAddress]);

  return { delegates, loading, error };
};
