import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { Button } from "src/Button";
import { Heading } from "src/Heading";

import * as Swap from "../Swap/Swap";

type Props = {
  isOpen: boolean;
  isConnected: boolean;
  senderData: {
    address: string | undefined;
    balance: string | undefined;
    ethAddress: string | undefined;
    symbol: string;
  };
  receiverData: {
    address: string | undefined | null;
    balance: string | undefined;
    ethAddress: string | undefined | null;
    symbol: string;
    vp?: number | undefined | null;
  };
  onClose: () => void;
  delegateTokens: () => void;
};

export const DelegateModal = ({
  isOpen = false,
  isConnected = false,
  senderData,
  receiverData,
  onClose,
  delegateTokens,
}: Props) => {
  const getTotalVotingPower = () => {
    return receiverData.vp
      ? (parseInt(receiverData.balance || "0") + receiverData.vp).toString()
      : receiverData.balance;
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
                <Swap.Arrow />
                <Swap.UserSummary
                  address={receiverData.address}
                  balance={getTotalVotingPower()}
                  symbol={receiverData.symbol}
                  text={"To"}
                />
              </Swap.Root>

              {isConnected && (
                <Button
                  type="submit"
                  variant="solid"
                  size="lg"
                  onClick={delegateTokens}
                >
                  Delegate your votes
                </Button>
              )}
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
