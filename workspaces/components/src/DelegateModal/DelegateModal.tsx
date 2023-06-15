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
  onClose: () => void;
};

export const DelegateModal = ({ isOpen = false, onClose }: Props) => {
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
                <Swap.UserSummary balance="100,000" />
                <Swap.Arrow />
                <Swap.UserSummary
                  address="0x03e61a95b01cB7d4b56f406aC2002FAB15Fb8B1f9B811cDb7eD58A08C7aE89232"
                  balance="50,000,000,000"
                  ethAddress="0x03e.eth"
                />
              </Swap.Root>

              <Button type="submit" variant="solid" size="lg">
                Delegate your votes
              </Button>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
