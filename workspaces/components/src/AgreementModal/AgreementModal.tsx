import {
  Stack,
} from "@chakra-ui/react";
import { Modal } from "../Modal";
import { MarkdownRenderer } from "#src/MarkdownRenderer";

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
      title="Delegation Agreement"
      overflowY="scroll"
      fixedHeader={true}
    >
      <Stack spacing="6">
        <MarkdownRenderer content={content || ""} />
      </Stack>
    </Modal>
  );
};
