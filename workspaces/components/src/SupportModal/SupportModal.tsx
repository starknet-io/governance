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
  StarknetOutlineIcon,
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
          <Heading color="content.accent.default" variant="h3">
            Support
          </Heading>
        </ModalHeader>
        <ModalCloseButton top="16px" />
        <ModalBody
          py={{ base: "4", md: "4", lg: "4" }}
          pb={{ base: "4" }}
          minHeight="272px"
        >
          <Stack spacing="standard.xl">
            <Text variant="medium">
              Are you looking for official Starknet support?{" "}
            </Text>
            <Text variant="medium">
              The first thing you should know is that we are decentralized. This
              means no central organization, entity, or person, and because of
              this, no official support channels exist. But you can ask help
              from the community!
            </Text>
          </Stack>
          <Flex flexDirection="column" gap="standard.sm" mt="standard.xl">
            <LinkBox
              icon={<StarknetCommunityIcon boxSize="32px" mr="3px" />}
              href="https://community.starknet.io/"
              label="Starknet community forum"
            />
            <LinkBox
              icon={<StarknetOutlineIcon boxSize="32px" mr="3px" />}
              href="https://www.starknet.io/"
              label="Starknet.io"
            />
            <LinkBox
              icon={<DiscordIcon boxSize="32px" mr="3px" />}
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
      rightIcon={
        <ExternalLinkIcon boxSize="20px" color="content.support.default" />
      }
      width="100%"
      justifyContent={"space-between"}
      height="56px"
      padding="standard.sm"
    >
      <Text
        variant="mediumStrong"
        color="content.default.default"
        marginRight="auto"
        letterSpacing={"0.07px"}
      >
        {label}
      </Text>
    </Button>
  );
};
