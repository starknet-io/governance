import {
  Box,
  Flex,
  Img,
  Spinner,
} from "@chakra-ui/react";
import { Modal } from "../Modal";

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
      title="Confirm transaction in wallet"
    >
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
    </Modal>
  );
};
