import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";
import { useBalanceData } from "src/utils/hooks";
import { useStarknetBalance } from "../hooks/starknet/useStarknetBalance";

const DELEGATE_CREATION_MINIMUM = 1;
const DELEGATE_CREATION_TOKEN = "STRK";
const starknetContract = import.meta.env.VITE_APP_STRK_CONTRACT;

export const useCheckBalance = ({
  ethAddress,
  starknetAddress,
}: {
  ethAddress?: string;
  starknetAddress?: string;
}) => {
  const toast = useToast();
  const ethBalanceData = useBalanceData(ethAddress as `0x${string}`, false);
  const { balance: starknetBalance, loading: starknetBalanceLoading } =
    useStarknetBalance({
      starknetAddress,
      starkContract: starknetContract,
    });
  console.log("Starknet Balance Loading:", starknetBalanceLoading);
  console.log("Ethereum Balance Data:", ethBalanceData);
  console.log("Starknet Balance:", starknetBalance);

  const checkUserBalance = useCallback(
    ({
      onSuccess,
      onFail,
    }: {
      onSuccess?: () => void;
      onFail?: () => void;
    }) => {
      console.log("Checking user balance...");
      const ethLoaded = ethBalanceData.isFetched || !ethAddress;
      console.log("Ethereum Data Loaded:", ethLoaded);
      console.log("Starknet Balance Loading:", starknetBalanceLoading);

      if (ethLoaded && !starknetBalanceLoading && starknetBalance) {
        const hasSufficientEthBalance =
          ethBalanceData?.balance &&
          parseFloat(ethBalanceData?.balance) >= DELEGATE_CREATION_MINIMUM;
        const hasSufficientStarknetBalance =
          starknetBalance?.rawBalance &&
          parseFloat(starknetBalance?.rawBalance) >= DELEGATE_CREATION_MINIMUM;

        console.log(
          "Has Sufficient Ethereum Balance:",
          hasSufficientEthBalance,
        );
        console.log(
          "Has Sufficient Starknet Balance:",
          hasSufficientStarknetBalance,
        );

        if (hasSufficientEthBalance || hasSufficientStarknetBalance) {
          onSuccess?.();
        } else {
          toast({
            position: "top-right",
            title: `Insufficient Balance`,
            description: `You must have at least ${DELEGATE_CREATION_MINIMUM} ${DELEGATE_CREATION_TOKEN} in either Ethereum or Starknet to create a delegate profile`,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          onFail?.();
        }
      }
    },
    [ethBalanceData.isFetched, ethBalanceData?.balance, starknetBalance],
  );

  return { checkUserBalance };
};
