import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { Modal } from "../Modal";
import { Button } from "../Button";
import { WarningIcon } from "src/Icons";
import { truncateAddress } from "../utils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  isSuccess?: boolean;
  isFail?: boolean;
  isPending?: boolean;
  ethAddress?: string;
  ethNetwork?: string;
  expectedEthAddress?: string;
  expectedEthNetwork?: string;
  starknetAddress?: string;
  expectedStarknetAddress?: string;
  expectedStarknetNetwork?: string;
};

export const WrongAccountOrNetworkModal = ({
  isOpen = false,
  onClose,
  ethAddress,
  ethNetwork,
  expectedEthAddress,
  starknetAddress,
  expectedStarknetAddress,
}: Props) => {
  if (!ethAddress && !starknetAddress) {
    return null;
  }
  const renderDescription = () => {
    if (ethAddress) {
      return (
        <Flex flexDirection="column" gap="standard.md">
          <Box>
            <Text
              align="center"
              variant="mediumStrong"
              color="content.support.default"
            >
              Your wallet has the wrong account active:
            </Text>
            <Text
              align="center"
              variant="mediumStrong"
              color="content.default.default"
            >
              {truncateAddress(ethAddress)}
            </Text>
          </Box>
          <Box>
            <Text
              align="center"
              variant="mediumStrong"
              color="content.support.default"
            >
              Your Governance Hub account is tied to:
            </Text>
            <Text
              align="center"
              variant="mediumStrong"
              color="content.default.default"
            >
              {truncateAddress(expectedEthAddress || "")}
            </Text>
          </Box>
          <Text
            variant="mediumStrong"
            color="content.support.default"
            align="center"
          >
            To use your Ethereum account, switch to account{" "}
            {truncateAddress(expectedEthAddress || "")} and make sure you are
            using the correct network
          </Text>
        </Flex>
      );
    } else if (starknetAddress) {
      return (
        <Flex flexDirection="column" gap="standard.md">
          <Box>
            <Text
              align="center"
              variant="mediumStrong"
              color="content.support.default"
            >
              Your wallet has the wrong account active:
            </Text>
            <Text
              align="center"
              variant="mediumStrong"
              color="content.default.default"
            >
              {truncateAddress(starknetAddress || "")}
            </Text>
          </Box>
          <Box>
            <Text
              align="center"
              variant="mediumStrong"
              color="content.support.default"
            >
              Your Governance Hub account is tied to:
            </Text>
            <Text
              align="center"
              variant="mediumStrong"
              color="content.default.default"
            >
              {truncateAddress(expectedStarknetAddress || "")}
            </Text>
          </Box>
          <Text
            variant="mediumStrong"
            color="content.support.default"
            align="center"
          >
            To use your Starknet account, switch to account{" "}
            <strong>{truncateAddress(expectedStarknetAddress || "")}</strong>{" "}
            and make sure you are using the correct network
          </Text>
        </Flex>
      );
    } else {
      return "";
    }
  };

  const title = ethAddress
    ? "Wrong ethereum account"
    : "Wrong starknet account";
  const description = renderDescription();
  return (
    <Modal
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={onClose}
      maxHeight={"70%"}
      isCentered
      title={title}
    >
      <Flex
        flex={1}
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <WarningIcon boxSize="104px" color="#E54D66" />
      </Flex>
      {description}
      <Modal.Footer>
        <Button
          type="button"
          variant="primary"
          size="standard"
          onClick={onClose}
          width="100%"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
