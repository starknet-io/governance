import { useEffect, useState } from "react";
import {
  Stack,
  FormControl,
  Box,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Button } from "src/Button";
import * as Swap from "../Swap/Swap";
import { Text } from "../Text";
import { ethers } from "ethers";
import { Modal } from "../Modal";
import { validateStarknetAddress } from "@yukilabs/governance-frontend/src/utils/helpers";
import { Banner } from "../Banner/Banner";

type Props = {
  isOpen: boolean;
  isConnected: boolean;
  senderData: {
    address: string | undefined;
    balance: string | undefined;
    ethAddress: string | undefined;
    symbol: string;
  };
  senderDataL2: {
    address: string | undefined;
    balance: string | undefined;
    symbol: string;
  };
  receiverData?: {
    address: string | undefined | null;
    balance: string | undefined;
    ethAddress: string | undefined | null;
    symbol: string;
    vp?: number | undefined | null;
  };
  onClose: () => void;
  delegateTokens: () => void;
  onContinue?: (address: string) => void;
  isUndelegation?: boolean;
  isLayer1Delegation?: boolean;
  handleWalletSelect?: (address: string) => void;
  isLayer2Delegation?: boolean;
  activeAddress?: string;
};

export const DelegateModal = ({
  isOpen = false,
  isConnected = false,
  senderData,
  senderDataL2,
  activeAddress,
  receiverData,
  onClose,
  delegateTokens,
  onContinue,
  isUndelegation,
  isLayer1Delegation,
  isLayer2Delegation,
  handleWalletSelect,
}: Props) => {
  const [customAddress, setCustomAddress] = useState("");
  const l1Delegation =
    isLayer1Delegation || (!isLayer1Delegation && !isLayer2Delegation);
  const l2Delegation = !l1Delegation;
  const [selectedAddress, setSelectedAddress] = useState("");

  const handleSelect = (address: string) => {
    if (handleWalletSelect) {
      handleWalletSelect(address);
    }
    setSelectedAddress(address);
  };
  const getTotalVotingPower = () => {
    return receiverData?.vp || receiverData?.vp === 0
      ? receiverData.vp.toString()
      : receiverData?.balance?.toString() || "0";
  };

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isValidAddress(customAddress)) {
      if (l2Delegation) {
        setError("Not a valid starknet address")
      } else {
        setError("Not a valid ethereum address")
      }
    } else {
      setError(null);
    }
  }, [customAddress, activeAddress]);

  const isValidEthAddress = (address: string) => {
    try {
      const checksumAddress = ethers.utils.getAddress(address);
      return ethers.utils.isAddress(checksumAddress);
    } catch (error) {
      return false;
    }
  };

  const isValidAddress = (address: string) => {
    if (l2Delegation) {
      return validateStarknetAddress(address);
    } else {
      return isValidEthAddress(address);
    }
  };

  return (
    <Modal
      maxHeight={"80%"}
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={onClose}
      title={
        isUndelegation ? "Undelegate voting power" : "Delegate voting power"
      }
    >
      <Stack spacing="6">
        <Stack spacing="standard.xl">
          <Swap.Root>
            <Swap.UserSummary
              address={senderData.address}
              balance={senderData.balance}
              symbol={senderData.symbol}
              isSender
              isSelected={senderData.address === activeAddress}
              onClick={() => handleSelect(senderData.address!)}
            />
            <Box mt="standard.xs">
              {senderDataL2 ? (
                <Swap.UserSummary
                  address={senderDataL2.address}
                  balance={senderDataL2.balance}
                  symbol={senderDataL2.symbol}
                  isSender
                  isSelected={senderDataL2.address === activeAddress}
                  onClick={() => handleSelect(senderDataL2.address!)}
                  sx={{
                    marginTop: "standard.xs",
                  }}
                />
              ) : (
                <Banner label="Delegate only has an Ethereum address currently. Please connect an Ethereum address to your account to delegate to this address." />
              )}
            </Box>
            {receiverData ? (
              <>
                <Swap.Arrow />
                <Swap.UserSummary
                  address={receiverData.address}
                  balance={getTotalVotingPower()}
                  symbol={receiverData.symbol}
                  isReceiver
                  text={"To"}
                />
              </>
            ) : (
              <>
                <Swap.Arrow />
                <Box
                  fontSize="14px"
                  bg="#FAFAFA"
                  p="16px"
                  border="1px solid #E4E5E7"
                  borderRadius="8px"
                  color="#6C6C75"
                  display="flex"
                  justifyContent="space-between"
                >
                  <FormControl isInvalid={true}>
                    <FormLabel>
                      <Text color="#6C6C75" as="span">
                        Receiver
                      </Text>
                    </FormLabel>
                    <Input
                      placeholder="0x..."
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                    />
                    {error && customAddress !== "" && (
                      <FormErrorMessage>
                        {error}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </Box>
              </>
            )}
          </Swap.Root>
          {receiverData ? (
            isConnected && (
              <Button
                type="submit"
                variant="primary"
                size="lg"
                onClick={delegateTokens}
              >
                {isUndelegation
                  ? "Undelegate voting power"
                  : "Delegate voting power"}
              </Button>
            )
          ) : (
            <Button
              variant="primary"
              type="submit"
              isDisabled={!customAddress || !!error}
              onClick={() => {
                if (onContinue) {
                  onContinue(customAddress);
                }
              }}
              fontSize="14px"
              fontWeight="500"
              lineHeight="20px"
              letterSpacing="0.07px"
            >
              Continue
            </Button>
          )}
        </Stack>
      </Stack>
    </Modal>
  );
};
