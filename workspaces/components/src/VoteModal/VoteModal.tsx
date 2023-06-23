import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { Heading } from "../Heading";
type Props = {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

// const choices: {
//   [index: number]: string;
// } = {
//   1: "For",
//   2: "Against",
//   3: "Abstain",
// };

export const VoteModal = ({ children, isOpen = false, onClose }: Props) => {
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
              Confirm Vote
            </Heading>

            {children}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
