import React from "react";
import {
  Button,
  EthereumIcon,
  Modal,
  StarknetIcon,
  Text,
} from "@yukilabs/governance-components";
import { Flex, Icon, Stack } from "@chakra-ui/react";
import { DynamicConnectButton } from "@dynamic-labs/sdk-react-core";
import "./ConnectSecondaryWalletModal.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  withSkip?: boolean;
  shouldConnectStarknet?: boolean;
  shouldConnectEthereum?: boolean;
};
const ConnectSecondaryWalletModal = ({
  isOpen,
  onClose,
  shouldConnectStarknet,
  shouldConnectEthereum,
  onNext,
  withSkip,
}: Props) => {
  return (
    <Modal
      useInert={false}
      isOpen={isOpen}
      isCentered
      onClose={onClose}
      title={`Connect ${
        shouldConnectEthereum ? "Ethereum" : "Starknet"
      } address`}
    >
      <Stack spacing={4} mb="spacing-lg">
        <Text variant="medium" color="content.default.default">
          Would you like to add a{" "}
          {shouldConnectEthereum ? "Ethereum" : "Starknet"} address to your
          Governance Hub profile?
        </Text>
        <Text variant="medium" color="content.default.default">
          This enables you to manage voting and delegation with your STRK tokens
          across Ethereum and Starknet.
        </Text>
      </Stack>
      <Flex flexDirection="column">
        <DynamicConnectButton buttonClassName="dynamic-custom-button">
          <Button variant="secondary" w="100%">
            <Flex gap="6px" alignItems="center" justifyContent="center">
              {!shouldConnectEthereum ? (
                <>
                  <Icon as={StarknetIcon} />
                  <Text variant="mediumStrong" color="content.default.default">
                    Connect Starknet
                  </Text>
                </>
              ) : (
                <>
                  <Icon as={EthereumIcon} />
                  <Text variant="mediumStrong" color="content.default.default">
                    Connect Ethereum
                  </Text>
                </>
              )}
            </Flex>
          </Button>
        </DynamicConnectButton>
        {withSkip && (
          <Button onClick={onNext} w="100%" mt="standard.sm">
            Skip
          </Button>
        )}
      </Flex>
    </Modal>
  );
};

export default ConnectSecondaryWalletModal;
