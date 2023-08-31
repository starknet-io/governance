import {
  Box,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import {
  StarknetCommunityIcon,
  StarknetIcon,
  DiscordIcon,
  HiOutlineArrowUpRight,
} from "src/Icons";
import { Text } from "../Text";
import { Heading } from "src/Heading";
import "./support-modal.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const SupportModal = ({ isOpen = false, onClose }: Props) => {
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
      <ModalContent borderRadius="xl" minHeight="272px" overflowY="scroll">
        <ModalHeader textAlign="center">
          <Heading fontSize="21px" fontWeight="semibold" variant="h3">
            Support
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          py={{ base: "4", md: "4", lg: "4" }}
          pb={{ base: "4" }}
          minHeight="272px"
        >
          <Stack spacing="4">
            <Text>Are you looking for official Starknet support? </Text>
            <Text>
              The first thing you should know is that we are decentralized. This
              means no central organization, entity, or person, and because of
              this, no official support channels exist. But you can ask help
              from the community!
            </Text>
          </Stack>
          <Link
            mt="4"
            className="link-box"
            href="https://community.starknet.io/"
            target="_blank"
          >
            <StarknetCommunityIcon />
            <Text marginLeft={"6px"}>Starknet community forum</Text>
            <HiOutlineArrowUpRight style={{ marginLeft: "auto" }} />
          </Link>
          <Link
            mt="4"
            className="link-box"
            href="https://www.starknet.io/"
            target="_blank"
          >
            <StarknetIcon />
            <Text marginLeft={"6px"}> Starknet.io </Text>
            <HiOutlineArrowUpRight style={{ marginLeft: "auto" }} />
          </Link>
          <Box mt="4" className="link-box">
            <DiscordIcon /> <Text marginLeft={"6px"}>Starknet Discord</Text>
            <HiOutlineArrowUpRight style={{ marginLeft: "auto" }} />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
