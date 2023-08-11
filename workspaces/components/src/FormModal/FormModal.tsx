import { FC, ReactNode } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSubmit: () => void;
  children: ReactNode;
  isValid?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
}

export const FormModal: FC<FormModalProps> = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  children,
  isValid = true,
  submitButtonText = "Save",
  cancelButtonText = "Cancel",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <ModalBody>{children}</ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              {cancelButtonText}
            </Button>
            <Button
              type="submit"
              variant="outline"
              color="#D83E2C"
              ml={3}
              disabled={!isValid}
            >
              {submitButtonText}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
