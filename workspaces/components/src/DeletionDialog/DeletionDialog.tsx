import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Icon,
} from "@chakra-ui/react";
import { TrashWarningIcon } from "@yukilabs/governance-components/src/Icons";
import { useRef } from "react";

interface DeletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  cancelRef: React.Ref<HTMLElement>;
  entityName?: string;
}

export function DeletionDialog({
  isOpen,
  onClose,
  onDelete,
  cancelRef,
  entityName = "Entity",
}: DeletionDialogProps) {
  cancelRef = useRef<HTMLElement>(null);

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader
            fontSize="lg"
            fontWeight="bold"
            display={"flex"}
            justifyContent={"center"}
          >
            Confirm {entityName} Deletion
            <AlertDialogCloseButton />
          </AlertDialogHeader>

          <AlertDialogBody display={"flex"} justifyContent={"center"}>
            <Icon as={TrashWarningIcon} boxSize={104} />
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button variant="solid" onClick={onDelete} width={"100%"}>
              Delete {entityName}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
