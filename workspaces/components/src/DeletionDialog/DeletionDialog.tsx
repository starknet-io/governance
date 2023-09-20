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
import { TrashWarningIcon } from "@yukilabs/governance-components/src/Icons";
import { useRef } from "react";

interface DeletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  cancelRef: React.Ref<HTMLElement>;
  entityName?: string;
  customTitle?: string;
  customDeleteTitle?: string;
}

export function DeletionDialog({
  isOpen,
  onClose,
  onDelete,
  cancelRef,
  entityName = "Entity",
  customTitle,
  customDeleteTitle,
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
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader
            fontSize="lg"
            fontWeight="bold"
            display={"flex"}
            justifyContent={"center"}
            maxWidth="70%"
            mx="auto"
            textAlign="center"
          >
            {customTitle ? customTitle : `Confirm ${entityName} Deletion`}
            <AlertDialogCloseButton />
          </AlertDialogHeader>

          <AlertDialogBody display={"flex"} justifyContent={"center"}>
            <Icon as={TrashWarningIcon} boxSize={104} />
          </AlertDialogBody>

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
