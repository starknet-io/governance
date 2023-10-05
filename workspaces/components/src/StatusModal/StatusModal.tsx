import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";

import { Heading } from "../Heading";
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
    >
      <ModalOverlay />
      <ModalContent borderRadius="xl" overflow="hidden">
        <ModalCloseButton
          top="0"
          right="0"
          size="lg"
          borderRadius="none"
          borderBottomLeftRadius="md"
        />
        <ModalBody minHeight="272px">
          <Stack spacing="6">
            <Heading
              textAlign="center"
              fontSize="21px"
              fontWeight="semibold"
              variant="h3"
            >
              {title}
            </Heading>
            <Flex
              minHeight="144px"
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
            <Text align="center" variant="mediumStrong">
              {description}
            </Text>
            <Button
              type="button"
              variant="primary"
              size="standard"
              onClick={onClose}
            >
              Close
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
