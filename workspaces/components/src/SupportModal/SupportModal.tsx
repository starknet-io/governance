import {
  Button,
  Flex,
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
  ExternalLinkIcon,
} from "src/Icons";
import { Text } from "../Text";
import { Heading } from "src/Heading";
import React from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const SupportModal = ({ isOpen = false, onClose }: Props) => {
  return (
    // TODO: New variant for modal, use tokens
    <Modal
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      isCentered
      variant="unstyled"
    >
      <ModalOverlay />
      <ModalContent
        borderRadius="xl"
        minHeight="300px"
        overflowY="scroll"
        padding="8px"
      >
        <ModalHeader textAlign="center">
          <Heading fontSize="21px" fontWeight="semibold" variant="h3">
            Support
          </Heading>
        </ModalHeader>
        <ModalCloseButton top="16px" />
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
          <Flex flexDirection="column" gap="12px" mt="24px">
            <LinkBox
              icon={<StarknetCommunityIcon boxSize="20px" />}
              href="https://community.starknet.io/"
              label="Starknet community forum"
            />
            <LinkBox
              icon={<StarknetIcon boxSize="20px" />}
              href="https://www.starknet.io/"
              label="Starknet.io"
            />
            <LinkBox
              icon={<DiscordIcon boxSize="20px" />}
              href="https://discord.com/invite/qypnmzkhbc"
              label="Starknet Discord"
            />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

type LinkBoxProps = {
  href: string;
  icon?: React.ReactElement;
  label: string;
};
const LinkBox = ({ href, icon, label }: LinkBoxProps) => {
  return (
    <Button
      href={href}
      as="a"
      variant="outline"
      target={"_blank"}
      size="lg"
      leftIcon={icon}
      rightIcon={<ExternalLinkIcon />}
      width="100%"
      justifyContent={"space-between"}
      height="44px"
      padding="12px 20px"
    >
      <Text
        marginRight="auto"
        fontSize={"14px"}
        fontWeight="500"
        lineHeight="20px"
        letterSpacing="0.07px"
        color="#4A4A4F"
      >
        {label}
      </Text>
    </Button>
  );
};
