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
import { Heading } from "../Heading";
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
    avatarString?: string;
  };
  receiverDataL2?: {
    address: string | undefined | null;
    balance: string | undefined;
    symbol: string;
    vp?: number | undefined | null;
    avatarString?: string;
  };
  onClose: () => void;
  delegateTokens: () => void;
  onContinue?: (address: string) => void;
  isUndelegation?: boolean;
  isLayer1Delegation?: boolean;
  isSelfDelegation?: boolean;
  handleWalletSelect?: (address: string) => void;
  isLayer2Delegation?: boolean;
  activeAddress?: string;
};

export const DelegateModal = ({
  isOpen = false,
  isSelfDelegation = false,
  isConnected = false,
  senderData,
  senderDataL2,
  activeAddress,
  receiverData,
  receiverDataL2,
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

  const handleSelect = (address: string) => {
    if (handleWalletSelect) {
      handleWalletSelect(address);
    }
  };
  const getTotalVotingPower = (receiverData: any) => {
    return receiverData?.vp || receiverData?.vp === 0
      ? receiverData.vp.toString()
      : receiverData?.balance?.toString() || "0";
  };

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isValidAddress(customAddress)) {
      if (l2Delegation) {
        setError("Not a valid starknet address");
      } else {
        setError("Not a valid ethereum address");
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

  const canBeDelegatedOnSpecifiedLayer =
    (receiverData?.address && l1Delegation) || (receiverDataL2?.address && l2Delegation);
  return (
    <Modal
      maxHeight={"85%"}
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={onClose}
      title={isUndelegation ? "Undelegate votes" : "Delegate votes"}
    >
      <Stack spacing="6">
        <Stack spacing="standard.xl">
          <Swap.Root>
            <Text
              variant="mediumStrong"
              color="content.support.default"
              mb="standard.xs"
            >
              From your wallet
            </Text>
            {senderData?.address ? (
              <Swap.UserSummary
                address={senderData.address}
                balance={senderData.balance}
                symbol={senderData.symbol}
                isSender
                text="Ethereum"
                isSelected={senderData.address === activeAddress}
                onClick={() => handleSelect(senderData.address!)}
              />
            ) : null}
            <Box>
              {senderDataL2?.address ? (
                <Swap.UserSummary
                  address={senderDataL2.address}
                  balance={senderDataL2.balance}
                  symbol={senderDataL2.symbol}
                  isSender
                  text="Starknet"
                  isSelected={senderDataL2.address === activeAddress}
                  onClick={() => handleSelect(senderDataL2.address!)}
                  sx={{
                    marginTop: "standard.xs",
                  }}
                />
              ) : null}
            </Box>
            {receiverData?.address && l1Delegation && !isSelfDelegation ? (
              <>
                <Swap.Arrow />
                <Text
                  variant="mediumStrong"
                  color="content.support.default"
                  mb="standard.xs"
                >
                  To delegate
                </Text>
                <Swap.UserSummary
                  address={receiverData.address}
                  balance={getTotalVotingPower(receiverData)}
                  symbol={receiverData.symbol}
                  isReceiver
                  text={"To"}
                  imgUrl={receiverData?.avatarString?.toString()}
                />
              </>
            ) : null}
            {receiverDataL2?.address && l2Delegation && !isSelfDelegation ? (
              <>
                <Swap.Arrow />
                <Text
                  variant="mediumStrong"
                  color="content.support.default"
                  mb="standard.xs"
                >
                  To delegate
                </Text>
                <Swap.UserSummary
                  address={receiverDataL2.address}
                  balance={getTotalVotingPower(receiverDataL2)}
                  symbol={receiverDataL2.symbol}
                  isReceiver
                  text={"To"}
                  imgUrl={receiverDataL2?.avatarString?.toString()}
                />
              </>
            ) : null}
            {!receiverData?.address && !receiverDataL2 && !isSelfDelegation && (
              <>
                <Swap.Arrow />
                <Text
                  variant="mediumStrong"
                  color="content.support.default"
                  mb="standard.xs"
                >
                  To delegate
                </Text>
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
                      isInvalid={customAddress !== "" && !!error}
                    />
                    {error && customAddress !== "" && (
                      <FormErrorMessage>{error}</FormErrorMessage>
                    )}
                  </FormControl>
                </Box>
              </>
            )}
          </Swap.Root>
          {!canBeDelegatedOnSpecifiedLayer &&
            (receiverDataL2?.address || receiverData?.address) &&
            !isSelfDelegation && (
              <Banner
                label={`This delegate hasn't linked a ${
                  l2Delegation ? "Starknet" : "Ethereum"
                } address to their profile. Currently, you can only delegate to them using an ${
                  l2Delegation ? "Ethereum" : "Starknet"
                } wallet.`}
              />
            )}
          {canBeDelegatedOnSpecifiedLayer || isSelfDelegation ? (
            isConnected && (
              <Button
                type="submit"
                variant="primary"
                size="lg"
                onClick={delegateTokens}
              >
                {isUndelegation ? "Undelegate votes" : "Delegate votes"}
              </Button>
            )
          ) : (
            <Button
              variant="primary"
              type="submit"
              isDisabled={
                (!customAddress ||
                  !!error ||
                  (!canBeDelegatedOnSpecifiedLayer &&
                    (!!receiverDataL2?.address || !!receiverData?.address))) &&
                !isSelfDelegation
              }
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
