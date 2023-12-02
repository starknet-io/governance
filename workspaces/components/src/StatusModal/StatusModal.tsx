import {
  Flex,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Modal } from "../Modal";
import { Button } from "../Button";
import { SuccessIcon, WarningIcon } from "src/Icons";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  isSuccess?: boolean;
  isFail?: boolean;
  isPending?: boolean;
};

export const StatusModal = ({
  isOpen = false,
  onClose,
  title,
  description,
  isFail,
  isPending,
  isSuccess,
}: Props) => {
  return (
    <Modal
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      title={title}
    >
      <Flex
        flex={1}
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        {isPending && <Spinner size="xxl" />}
        {isFail && !isPending && (
          <WarningIcon boxSize="104px" color="#E54D66" />
        )}
        {isSuccess && !isPending && (
          <SuccessIcon boxSize="104px" color="#29AB87" />
        )}
      </Flex>
      {description ? <Text align="center" variant="mediumStrong">
        {description}
      </Text> : null}
      <Modal.Footer>
        <Button
          type="button"
          variant="primary"
          size="standard"
          onClick={onClose}
          width="100%"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
