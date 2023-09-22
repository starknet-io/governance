import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { MarkdownRenderer } from "src/MarkdownRenderer";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  content: any;
};

export const AgreementModal = ({ isOpen = false, onClose, content }: Props) => {
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
        minHeight="272px"
        maxHeight={{ base: "100%", md: "80%", lg: "60%" }}
        overflowY="scroll" // Add this line to enable vertical scrolling
      >
        <ModalHeader textAlign="center"> Delegation Agreement</ModalHeader>
        <ModalCloseButton
          top="0"
          right="0"
          size="lg"
          borderRadius="none"
          borderBottomLeftRadius="md"
        />
        <ModalBody
          px={{ base: "4", md: "4", lg: "4" }}
          py={{ base: "4", md: "4", lg: "4" }}
          pb={{ base: "4" }}
          minHeight="272px"
        >
          <Stack spacing="6">
            <MarkdownRenderer content={content || ""} />
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
