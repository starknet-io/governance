import { Modal } from "../Modal";
import { Box, Flex, Image } from "@chakra-ui/react";
import delegatesOnboardingImage from "../EmptyState/assets/delegate-onboarding.svg";
import { Text } from "../Text";
import { Button } from "../Button";
import { navigate } from "vite-plugin-ssr/client/router";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};
export const DelegateOnboardingModalBasic = ({ isOpen, onClose }: Props) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxHeight="76%"
      title="Delegating voting power"
      motionPreset="slideInBottom"
    >
      <Flex flexDirection="column" gap="standard.lg">
        <Flex w="100%" alignItems="center" justifyContent="center">
          <Image src={delegatesOnboardingImage} width="164px" />
        </Flex>
        <Flex flexDirection="column" gap="standard.xs">
          <Text variant="largeStrong" color="content.accent.default">
            Vote Yourself
          </Text>
          <Text variant="small" color="content.default.default">
            Delegate your STRK to yourself in the delegates section in order to vote. If you hold STRK tokens on both Starknet and Ethereum, you're required to delegate them separately on each network.
          </Text>
        </Flex>
        <Flex flexDirection="column" gap="standard.xs">
          <Text variant="largeStrong" color="content.accent.default">
            Delegate to a community member
          </Text>
          <Text variant="small" color="content.default.default">
            Prefer not to vote? Delegate your STRK voting power to a community member. If you hold STRK tokens on both Starknet and Ethereum, you're required to delegate them separately on each network.
          </Text>
        </Flex>
        <Button
          onClick={() => {
            navigate("/delegates");
            onClose()
          }}
        >
          View delegates
        </Button>
      </Flex>
    </Modal>
  );
};

export default DelegateOnboardingModalBasic;
