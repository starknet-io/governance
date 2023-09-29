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
  children: React.ReactNode;
  title: string;
};

export const InfoModal = ({
  title,
  children,
  isOpen = false,
  onClose,
}: Props) => {
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
          top="0"
          right="0"
          size="lg"
          borderRadius="none"
          borderBottomLeftRadius="md"
        />
        <ModalBody>
          <Stack spacing="32px">
            <Heading
              textAlign={"center"}
              fontSize="21px"
              fontWeight="600"
              variant="h3"
              mb="0"
            >
              {title}
            </Heading>
            {children}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
