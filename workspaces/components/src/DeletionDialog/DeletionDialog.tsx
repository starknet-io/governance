import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { TrashWarningIcon } from "../Icons";
import { useRef } from "react";

interface DeletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  cancelRef: React.Ref<HTMLElement>;
  entityName?: string;
  customTitle?: string;
  customDeleteTitle?: string;
  children?: JSX.Element;
}

export function DeletionDialog({
  isOpen,
  onClose,
  onDelete,
  cancelRef,
  entityName = "Entity",
  customTitle,
  customDeleteTitle,
  children,
}: DeletionDialogProps) {
  cancelRef = useRef<HTMLElement>(null);
  const toast = useToast();

  const handleDeleteClick = () => {
    onDelete();
    toast({
      position: "top-right",
      title: `${entityName} deleted`,
      description: `${entityName} is now deleted`,
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="lg"
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader
            fontSize="lg"
            fontWeight="bold"
            display={"flex"}
            justifyContent={"center"}
            maxWidth="90%"
            mx="auto"
            textAlign="center"
          >
            {customTitle ? customTitle : `Confirm ${entityName} Deletion`}
            <AlertDialogCloseButton />
          </AlertDialogHeader>

          {!children ? (
            <AlertDialogBody
              display={"flex"}
              justifyContent={"center"}
              gap="24px"
            >
              <TrashWarningIcon boxSize={104} color="#E4442F" />
            </AlertDialogBody>
          ) : (
            children
          )}

          <AlertDialogFooter>
            <Flex gap="1" width="100%" justifyContent="space-between">
              <Button variant="ghost" onClick={onClose} width={"100%"}>
                Cancel
              </Button>
              <Button onClick={handleDeleteClick} width={"100%"}>
                {customDeleteTitle ? customDeleteTitle : `Delete ${entityName}`}
              </Button>
            </Flex>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
