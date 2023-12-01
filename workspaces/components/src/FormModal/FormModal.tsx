import { FC, ReactNode } from "react";
import {
  Button,
  Flex,
} from "@chakra-ui/react";
import { Modal } from "../Modal";

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
    >
      <>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {children}
          <Modal.Footer>
            <Flex justifyContent="flex-end" gap="8px" width="100%">
              <Button size="condensed" variant="ghost" onClick={onClose}>
                {cancelButtonText}
              </Button>
              <Button
                size="condensed"
                type="submit"
                variant="primary"
                isDisabled={!isValid}
              >
                {submitButtonText}
              </Button>
            </Flex>
          </Modal.Footer>
        </form>
      </>
    </Modal>
  );
};
