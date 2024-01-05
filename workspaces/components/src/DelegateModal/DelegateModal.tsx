import { useEffect, useState } from "react";
import {
  Stack,
  FormControl,
  Box,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Button } from "..//Button";
import * as Swap from "../Swap/Swap";
import { Text } from "../Text";
import { ethers } from "ethers";
import { Modal } from "../Modal";

type Props = {
  isOpen: boolean;
  isConnected: boolean;
  senderData: {
    address: string | undefined;
    balance: string | undefined;
    ethAddress: string | undefined;
    symbol: string;
  };
  receiverData?: {
    address: string | undefined | null;
    balance: string | undefined;
    ethAddress: string | undefined | null;
    symbol: string;
    vp?: number | undefined | null;
  };
  onClose: () => void;
  delegateTokens: () => void;
  onContinue?: (address: string) => void;
  isValidCustomAddress?: boolean;
  isUndelegation?: boolean;
};

export const DelegateModal = ({
  isOpen = false,
  isConnected = false,
  senderData,
  receiverData,
  onClose,
  delegateTokens,
  onContinue,
  isValidCustomAddress,
  isUndelegation,
}: Props) => {
  const [customAddress, setCustomAddress] = useState("");
  const getTotalVotingPower = () => {
    return receiverData?.vp || receiverData?.vp === 0
      ? receiverData.vp.toString()
      : receiverData?.balance?.toString() || "0";
  };

  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (isValidAddress(customAddress)) {
      setIsError(false);
    } else {
      setIsError(true);
    }
  }, [customAddress]);

  const isValidAddress = (address: string) => {
    try {
      const checksumAddress = ethers.utils.getAddress(address);
      return ethers.utils.isAddress(checksumAddress);
    } catch (error) {
      return false;
    }
  };

  return (
    <Modal
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={onClose}
      title={isUndelegation
        ? "Undelegate voting power"
        : "Delegate voting power"}
    >
      <Stack spacing="6">
        <Stack spacing="standard.xl">
          <Swap.Root>
            <Swap.UserSummary
              address={senderData.address}
              balance={senderData.balance}
              symbol={senderData.symbol}
              isSender
            />
            {receiverData ? (
              <>
                <Swap.Arrow />
                <Swap.UserSummary
                  address={receiverData.address}
                  balance={getTotalVotingPower()}
                  symbol={receiverData.symbol}
                  isReceiver
                  text={"To"}
                />
              </>
            ) : (
              <>
                <Swap.Arrow />
                <Box
                  fontSize="14px"
                  bg="#FAFAFA"
                  p="16px"
                  border="1px solid #E4E5E7"
                  borderRadius="8px"
                  color="#6C6C75"
                  display="flex"
                  justifyContent="space-between"
                >
                  <FormControl isInvalid={true}>
                    <FormLabel>
                      <Text color="#6C6C75" as="span">
                        Receiver
                      </Text>
                    </FormLabel>
                    <Input
                      placeholder="0x..."
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                    />
                    {isError && customAddress !== "" && (
                      <FormErrorMessage>
                        Not a valid ethereum address
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </Box>
              </>
            )}
          </Swap.Root>
          {receiverData ? (
            isConnected && (
              <Button
                type="submit"
                variant="primary"
                size="lg"
                onClick={delegateTokens}
              >
                {isUndelegation
                  ? "Undelegate voting power"
                  : "Delegate voting power"}
              </Button>
            )
          ) : (
            <Button
              variant="primary"
              type="submit"
              isDisabled={!customAddress || isError}
              onClick={() => {
                if (onContinue) {
                  onContinue(customAddress);
                }
              }}
              fontSize="14px"
              fontWeight="500"
              lineHeight="20px"
              letterSpacing="0.07px"
            >
              Continue
            </Button>
          )}
        </Stack>
      </Stack>
    </Modal>
  );
};
