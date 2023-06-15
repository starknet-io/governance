import {
  Box,
  Flex,
  Img,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { Heading } from "../Heading";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  imgUrl?: string;
};

export const ConfirmModal = ({
  isOpen = false,
  onClose,
  imgUrl = "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
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
              Confirm transaction in wallet
            </Heading>
            <Flex
              minHeight="144px"
              flex={1}
              alignItems="center"
              justifyContent="center"
              position="relative"
            >
              <Spinner size="xxl" />
              <Box
                position="absolute"
                left="50%"
                ml="-27px"
                top="50%"
                mt="-27px"
              >
                <Img width="54px" src={imgUrl} alt="wallet provider" />
              </Box>
            </Flex>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
