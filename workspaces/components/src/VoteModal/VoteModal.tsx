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
      isCentered
    >
      <ModalOverlay />
      <ModalContent borderRadius="xl" overflow="hidden">
        <ModalCloseButton
          top="standard.xl"
          right="standard.xl"
          size="lg"
          borderRadius="none"
          borderBottomLeftRadius="md"
          color="#4A4A4F"
        />
        <ModalBody>
          <Stack spacing="standard.xl">
            <Heading
              textAlign="center"
              color="content.accent.default"
              variant="h3"
            >
              Confirm Vote
            </Heading>

            {children}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
