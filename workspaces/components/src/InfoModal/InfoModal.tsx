import {
  Stack,
} from "@chakra-ui/react";
import { Modal } from "../Modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  size?: string;
};

export const InfoModal = ({
  title,
  children,
  isOpen = false,
  onClose,
  size = "md"
}: Props) => {
  return (
    <Modal
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      title={title}
      size={size}
    >
      <>
        <Stack spacing="standard.xl">
          {children}
        </Stack>
      </>
    </Modal>
  );
};
