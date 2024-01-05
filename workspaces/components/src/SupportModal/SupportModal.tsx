import {
  Button,
  Flex,
  Stack,
} from "@chakra-ui/react";
import {
  StarknetCommunityIcon,
  StarknetIcon,
  DiscordIcon,
  ExternalLinkIcon,
  StarknetOutlineIcon,
  LearnIcon,
  DiscourseIcon,
  BlogPostsIcon,
} from "../Icons";
import { Text } from "../Text";
import React from "react";
import { Modal } from "../Modal";

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
      isCentered
      variant="unstyled"
      title="Community links"
    >
      <>
        <Stack spacing="standard.xl">
          <Text variant="medium">
            Check out to following links to learn more about Starknet and the
            Starknet ecosystem, further engage in discussions, search for
            events near you, and ask for Starknet support.
          </Text>
          {/* <Text variant="medium">
            The first thing you should know is that we are decentralized. This
            means no central organization, entity, or person, and because of
            this, no official support channels exist. But you can ask help
            from the community!
          </Text> */}
        </Stack>
        <Flex flexDirection="column" gap="standard.sm">
          <LinkBox
            icon={<DiscourseIcon boxSize="32px" mr="3px" />}
            href="https://community.starknet.io/"
            label="Starknet community forum"
          />
          <LinkBox
            icon={<BlogPostsIcon boxSize="32px" mr="3px" />}
            href="https://www.starknet.io/en/posts/governance"
            label="Governance Blog posts"
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
      </>
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
