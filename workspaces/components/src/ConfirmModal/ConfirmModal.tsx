import { Box, Flex, Img, Spinner } from "@chakra-ui/react";
import Argent from "./Argent.png";
import { Modal } from "../Modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  imgUrl?: string;
  isStarknet?: boolean;
};

export const ConfirmModal = ({
  isOpen = false,
  onClose,
  imgUrl = "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
  isStarknet,
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
      </Flex>
    </Modal>
  );
};
