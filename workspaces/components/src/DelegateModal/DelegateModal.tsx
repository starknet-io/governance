import { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  FormControl,
  Box,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Button } from "src/Button";
import { Heading } from "src/Heading";
import * as Swap from "../Swap/Swap";
import { Text } from "../Text";

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
}: Props) => {
  const [customAddress, setCustomAddress] = useState("");
  const getTotalVotingPower = () => {
    if (receiverData) {
      return receiverData.vp
        ? (
            parseInt(receiverData.balance || "0") + (receiverData?.vp || 0)
          ).toString()
        : receiverData.balance;
    } else {
      return "0";
    }
  };
  return (
    <Modal
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      isCentered
      variant="unstyled"
    >
      <ModalOverlay />
      <ModalContent
        borderRadius="xl"
        mx={{ base: "2.5", lg: "16" }}
        overflow="hidden"
      >
        <ModalCloseButton
          top="0"
          right="0"
          size="lg"
          borderRadius="none"
          borderBottomLeftRadius="md"
        />
        <ModalBody
          px={{ base: "5", md: "12", lg: "16" }}
          py={{ base: "10", md: "12", lg: "16" }}
          pb={{ base: "6" }}
        >
          <Stack spacing="6">
            <Heading fontSize="21px" fontWeight="semibold" variant="h3">
              Delegate votes
            </Heading>
            <Stack spacing="32px">
              <Swap.Root>
                <Swap.UserSummary
                  address={senderData.address}
                  balance={senderData.balance}
                  symbol={senderData.symbol}
                />
                {receiverData ? (
                  <>
                    <Swap.Arrow />
                    <Swap.UserSummary
                      address={receiverData.address}
                      balance={getTotalVotingPower()}
                      symbol={receiverData.symbol}
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
                      <FormControl isInvalid={isValidCustomAddress === false}>
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
                        {isValidCustomAddress === false && (
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
                    Delegate your votes
                  </Button>
                )
              ) : (
                <Button
                  variant="primary"
                  type="submit"
                  isDisabled={!customAddress}
                  onClick={() => {
                    if (onContinue) {
                      onContinue(customAddress);
                    }
                  }}
                  size="lg"
                >
                  Continue
                </Button>
              )}
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
