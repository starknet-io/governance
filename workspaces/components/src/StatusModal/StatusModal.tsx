import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { MdTaskAlt } from "react-icons/md";
import { FiAlertOctagon } from "react-icons/fi";
import { Heading } from "../Heading";
import { Button } from "../Button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  isSuccess?: boolean;
  isFail?: boolean;
};

export const StatusModal = ({
  isOpen = false,
  onClose,
  title,
  description,
  isFail,
  isSuccess,
}: Props) => {
  return (
    <Modal
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      isCentered
      variant="unstyled"
    >
      <ModalOverlay />
      <ModalContent
        borderRadius="xl"
        mx={{ base: "2.5", lg: "16" }}
        overflow="hidden"
      >
        <ModalCloseButton
          top="0"
          right="0"
          size="lg"
          borderRadius="none"
          borderBottomLeftRadius="md"
        />
        <ModalBody
          px={{ base: "5", md: "12", lg: "16" }}
          py={{ base: "10", md: "12", lg: "16" }}
          pb={{ base: "6" }}
          minHeight="272px"
        >
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
              {isFail && <FiAlertOctagon size={48} color="#E54D66" />}
              {isSuccess && <MdTaskAlt size={48} color="#29AB87" />}
            </Flex>
            <Text align="center" variant="mediuStrong">{description}</Text>
            <Button type="button" variant="primary" size="lg" onClick={onClose}>
              Close
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
