import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";
import { useBalanceData } from "#src/utils/hooks";

const DELEGATE_CREATION_MINIMUM = 0.00001;
const DELEGATE_CREATION_TOKEN = "ETH";

export const useCheckBalance = (userAaddress: string) => {
  const toast = useToast();
  const userBalance = useBalanceData(userAaddress as `0x${string}`, true);
  const checkUserBalance = useCallback(
    ({
      onSuccess,
      onFail,
    }: {
      onSuccess?: () => void;
      onFail?: () => void;
    }) => {
      if (userBalance.isFetched) {
        if (parseFloat(userBalance?.balance) < DELEGATE_CREATION_MINIMUM) {
          // toast({
          //   position: "top-right",
          //   title: `Insufficient Balance`,
          //   description: `You must have at least ${DELEGATE_CREATION_MINIMUM} ${DELEGATE_CREATION_TOKEN} to create a delegate profile`,
          //   status: "error",
          //   duration: 9000,
          //   isClosable: true,
          // });
          onSuccess?.();

          // onFail?.();
        } else {
          onSuccess?.();
        }
      }
    },
    [userBalance.isFetched, userBalance?.balance],
  );

  return { checkUserBalance };
};
