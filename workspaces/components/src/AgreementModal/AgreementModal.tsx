import {
  Stack,
} from "@chakra-ui/react";
import { Modal } from "../Modal";
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
      title="Delegation Agreement"
      overflowY="scroll"
    >
      <Stack spacing="6">
        <MarkdownRenderer content={content || ""} />
      </Stack>
    </Modal>
  );
};
