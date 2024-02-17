import { useEffect, useState } from "react";
import { DocumentProps } from "../../renderer/types";
import { FormLayout } from "../../components/FormsCommon/FormLayout";
import {
  Heading,
  PageTitle,
  Text,
  Slider,
  Input,
  StarknetIcon,
  Button,
  Modal,
  Link,
  Skeleton,
} from "@yukilabs/governance-components";
import { navigate } from "vite-plugin-ssr/client/router";
import {
  WalletIcon,
  SuccessIcon,
  WarningIcon,
} from "@yukilabs/governance-components/src/Icons";
import {
  Box,
  Divider,
  Flex,
  Icon,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { useVotingPower } from "../../hooks/snapshotX/useVotingPower";
import { useBalanceData } from "../../utils/hooks";
import { useStarknetBalance } from "../../hooks/starknet/useStarknetBalance";
import { findMatchingWallet } from "../../utils/helpers";
import { WalletChainKey } from "../../utils/constants";
import { GasIcon, useUserWallets } from "@dynamic-labs/sdk-react-core";
import TabButton from "../../components/TabButton";
import * as Swap from "@yukilabs/governance-components/src/Swap/Swap";
import { useWrapVSTRK } from "../../hooks/starknet/useWrapVSTRK";
import { useUnwrapVSTRK } from "../../hooks/starknet/useUnwrapVSTRK";
import { useWallets } from "../../hooks/useWallets";
import { usePageContext } from "../../renderer/PageContextProvider";
import { useHelpMessage } from "../../hooks/HelpMessage";
import { useStarknetDelegates } from "../../hooks/starknet/useStarknetDelegates";

const RECEIVING_AMOUNT_SUBTRACT = 0.00001;
const starkContract = import.meta.env.VITE_APP_STRK_CONTRACT;
const vStarkContract = import.meta.env.VITE_APP_VSTRK_CONTRACT;

const WrapModal = ({
  isOpen,
  onClose,
  isUnwrap,
  isLoading,
  isSuccess,
  starkToWrap,
  error,
  txHash = "",
  handleAddToWallet,
  isArgentX,
}: {
  isOpen: boolean;
  onClose: () => void;
  isUnwrap?: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  starkToWrap: number;
  error: any;
  txHash: string | null;
  handleAddToWallet: () => Promise<any>;
  isArgentX?: boolean;
}) => {
  return (
    <Modal
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      isCentered
    >
      <Flex alignItems="center" direction="column" gap="standard.xl">
        <Flex alignItems="center" direction="column" gap="standard.xs">
          {isLoading && (
            <Flex direction="column" gap="standard.xs" alignItems="center">
              <Spinner size="xxl" />
              <Heading variant="h3" mt="standard.sm">
                {!isUnwrap ? "Wrapping..." : "Unwrapping..."}
              </Heading>
              <Text variant="mediumStrong" color="content.default.default">
                {isUnwrap
                  ? `You are unwrapping ${starkToWrap} vSTRK`
                  : `You are wrapping ${starkToWrap} STRK`}
              </Text>
              <Text variant="mediumStrong" color="content.default.default">
                {isUnwrap
                  ? `You will receive ${starkToWrap} STRK`
                  : `You will receive ${starkToWrap} vSTRK`}
              </Text>
            </Flex>
          )}
          {error && (
            <>
              <WarningIcon boxSize="104px" color="#E54D66" />
              <Heading variant="h3">Error</Heading>
              <Text variant="mediumStrong" color="content.default.default">
                {error?.message || error}
              </Text>
            </>
          )}
          {isSuccess && (
            <>
              <SuccessIcon boxSize="104px" color="#30B37C" />
              <Heading variant="h3">All done!</Heading>
              <Flex
                mb="standard.lg"
                flexDirection="column"
                alignItems="center"
                gap="standard.xs"
              >
                <Text variant="mediumStrong" color="content.default.default">
                  You{" "}
                  {isUnwrap
                    ? `unwrapped ${starkToWrap} vSTRK`
                    : `wrapped ${starkToWrap} STRK`}
                </Text>
                <Text variant="mediumStrong" color="content.default.default">
                  You{" "}
                  {isUnwrap
                    ? `received ${starkToWrap} STRK`
                    : `received ${starkToWrap} vSTRK`}
                </Text>
                <Link
                  isExternal
                  href={`https://sepolia.starkscan.co/tx/${txHash || ""}`}
                  variant="secondary"
                  size="small"
                  color="content.support.default"
                >
                  Review transaction details{" "}
                </Link>
              </Flex>
              {!isArgentX ? (
                <Flex
                  alignItems="center"
                  gap="standard.xs"
                  alignSelf="stretch"
                  p="0"
                >
                  <Text
                    variant="mediumStrong"
                    color="content.default.default"
                    sx={{
                      flex: "1 0 0",
                      textWrap: "wrap",
                      textAlign: "left",
                    }}
                  >
                    Add the vSTRK token to your wallet to track your balance.
                  </Text>
                </Flex>
              ) : null}
            </>
          )}
        </Flex>
      </Flex>
      {isSuccess ? (
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
      ) : null}
    </Modal>
  );
};

export function Page() {
  const wallets = useUserWallets();
  const { user } = usePageContext();
  const { starknetWallet } = useWallets();
  const isArgentX = starknetWallet?.connector?.name === "ArgentX";
  const ethAddress =
    findMatchingWallet(wallets, WalletChainKey.EVM)?.address || undefined;
  const starknetAddress =
    findMatchingWallet(wallets, WalletChainKey.STARKNET)?.address || undefined;
  const { data: votingPowerEthereum, isLoading: isVotingPowerEthereumLoading } =
    useVotingPower({
      address: ethAddress,
    });

  const { delegates: delegationDataL2 } = useStarknetDelegates({
    starknetAddress,
  });

  const delegateTo =
    delegationDataL2 && delegationDataL2.length && delegationDataL2 !== "0x00"
      ? delegationDataL2
      : starknetWallet?.address;

  const { data: votingPowerStarknet, isLoading: isVotingPowerStarknetLoading } =
    useVotingPower({
      address: starknetAddress,
    });
  const {
    balance: ethBalance,
    symbol: ethBalanceSymbol,
  } = useBalanceData(ethAddress as `0x${string}`);
  const { balance: starknetBalance, loading: isStarknetBalanceLoading } =
    useStarknetBalance({
      starknetAddress,
      starkContract: starkContract,
    });
  const { balance: vSTRKBalance, loading: isvSTRKBalanceLoading } =
    useStarknetBalance({
      starknetAddress,
      starkContract: vStarkContract,
    });
  const [sliderValue, setSliderValue] = useState(50);
  const [helpMessage, setHelpMessage] = useHelpMessage();
  const [activeTab, setActiveTab] = useState(0);
  const [starkToWrap, setStarkToWrap] = useState(0);
  const [wrappedStark, setWrappedStark] = useState(0);
  const isUnwrap = activeTab === 1;

  const {
    isOpen: isWrapOpen,
    onOpen: onWrapOpen,
    onClose: onWrapClose,
  } = useDisclosure();
  const {
    isOpen: isUnwrapOpen,
    onOpen: onUnwrapOpen,
    onClose: onUnwrapClose,
  } = useDisclosure();

  const {
    wrap,
    loading: isWrapLoading,
    error: wrapError,
    success: isWrapSuccess,
    transactionHash: wrapTxHash,
  } = useWrapVSTRK();

  const {
    unwrap,
    loading: isUnwrapLoading,
    error: unwrapError,
    success: isUnwrapSuccess,
    transactionHash: unwrapTxHash,
  } = useUnwrapVSTRK();

  const wrapTokens = async () => {
    if (!starknetAddress) {
      setHelpMessage("connectStarknetWalletMessage");
      return;
    }
    if (!isUnwrap) {
      onWrapOpen();
    } else {
      onUnwrapOpen();
    }

    try {
      if (!isUnwrap) {
        setWrappedStark(starkToWrap);
        await wrap(delegateTo, starkToWrap);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("wrapSuccess"));
        }
      } else {
        setWrappedStark(starkToWrap);
        await unwrap(delegateTo, starkToWrap);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("wrapSuccess"));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (starknetBalance?.rawBalance && !isUnwrap) {
      setStarkToWrap(parseFloat(starknetBalance?.rawBalance) / 2);
    } else if (vSTRKBalance?.rawBalance && isUnwrap) {
      setStarkToWrap(parseFloat(vSTRKBalance?.rawBalance) / 2);
    }
    setSliderValue(50);
  }, [starknetBalance?.rawBalance, vSTRKBalance?.rawBalance, isUnwrap]);

  const handleSliderChange = (val) => {
    setSliderValue(val);
    if (!starknetAddress) {
      setHelpMessage("connectStarknetWalletMessage");
      return;
    }
    if (isUnwrap) {
      const rawBalance = parseFloat(vSTRKBalance?.rawBalance) || 0;
      setStarkToWrap(Math.floor((val / 100) * rawBalance) - RECEIVING_AMOUNT_SUBTRACT);
    } else {
      const rawBalance = parseFloat(starknetBalance?.rawBalance) || 0;
      setStarkToWrap(Math.floor((val / 100) * rawBalance));
    }
  };
  const handleStarkToWrapAmount = (amount: number) => {
    const toSet = Math.min(amount, starknetBalance?.rawBalance);
    const rawBalance = parseFloat(starknetBalance?.rawBalance) || 0;
    setStarkToWrap(toSet - RECEIVING_AMOUNT_SUBTRACT);
    setSliderValue(Math.min(Math.floor((toSet / rawBalance) * 100), 100));
  };
  const handleStarkToUnWrapAmount = (amount: number) => {
    const toSet = Math.min(amount, vSTRKBalance?.rawBalance);
    const rawBalance = parseFloat(vSTRKBalance?.rawBalance) || 0;
    setStarkToWrap(toSet - RECEIVING_AMOUNT_SUBTRACT);
    setSliderValue(Math.min(Math.floor((toSet / rawBalance) * 100), 100));
  };

  const handleAddToWallet = async () => {
    const vStarkContract = import.meta.env.VITE_APP_VSTRK_CONTRACT;

    const data: any = {
      type: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: vStarkContract,
          name: "Starknet Voting Token",
          symbol: "vSTRK",
          decimals: "18",
          network: "sepolia",
        },
      },
    };

    if (typeof window !== "undefined") {
      if (window.starknet) {
        if (starknetWallet?.connector?.name === "Braavos") {
          await window.starknet_braavos.request(data);
        } else if (window?.starknet?.id === "argentX") {
          await window.starknet.request(data);
        }
      }
    }
  };

  return (
    <FormLayout>
      <Box width="100%">
        <Flex
          alignItems="flex-start"
          justifyContent="space-between"
          gap="standard.xl"
        >
          <PageTitle
            learnMoreLink={"/learn"}
            title="Manage vSTRK"
            description="Wrap STRK for vSTRK to vote and delegate on the Starknet network in the Governance Hub."
            maxW={undefined}
            mb={0}
          />
        </Flex>
        <Flex
          alignItems="flex-start"
          justifyContent="space-between"
          gap="24px"
          direction={{ base: "column", md: "row" }}
        >
          <Box
            border="1px solid"
            borderColor="border.dividers"
            borderRadius="4px"
            minW={{ base: "100%", md: "206px" }}
          >
            <Box
              borderBottom="1px solid"
              borderColor="border.dividers"
              py="standard.sm"
              px="standard.md"
              sx={{
                background:
                  "linear-gradient(270deg, rgba(240, 146, 128, 0.08) -0.13%, rgba(232, 120, 136, 0.12) 13.55%, rgba(214, 114, 239, 0.12) 58.47%, rgba(188, 161, 243, 0.08) 97.54%)",
              }}
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Box>
                  <Text variant="mediumStrong" color="content.default.default">
                    Total voting power
                  </Text>
                  {!isVotingPowerEthereumLoading &&
                  !isVotingPowerStarknetLoading ? (
                    <Text variant="largeStrong" color="content.accent.default">
                      {new Intl.NumberFormat().format(
                        parseInt(votingPowerEthereum.toString()) +
                          parseInt(votingPowerStarknet.toString()),
                      )}
                    </Text>
                  ) : (
                    <Skeleton height="16px" width="50%" borderRadius="md" />
                  )}
                </Box>
              </Flex>
            </Box>
            <Box py="standard.sm" px="standard.md">
              <Box>
                <Text variant="small" color="content.support.default">
                  vSTRK on Starknet
                </Text>
                {!isvSTRKBalanceLoading ? (
                  <Text color="content.accent.default" variant="mediumStrong">
                    {vSTRKBalance?.balance || 0}{" "}
                    {vSTRKBalance?.symbol || "STRK"}
                  </Text>
                ) : (
                  <Skeleton height="16px" width="60%" borderRadius="md" />
                )}
              </Box>
              <Box mt="standard.sm">
                <Text variant="small" color="content.support.default">
                  STRK on Starknet
                </Text>
                {!isStarknetBalanceLoading ? (
                  <Text color="content.accent.default" variant="mediumStrong">
                    {starknetBalance?.balance || 0}{" "}
                    {starknetBalance?.symbol || "STRK"}
                  </Text>
                ) : (
                  <Skeleton height="16px" width="60%" borderRadius="md" />
                )}
              </Box>
              <Divider my="standard.sm" />
              <Box mt="standard.sm">
                <Text variant="small" color="content.support.default">
                  STRK on Ethereum
                </Text>
                <Text color="content.accent.default" variant="mediumStrong">
                  {!ethAddress ? "-" : `${new Intl.NumberFormat().format(Number(ethBalance))} ${ethBalanceSymbol}`}
                </Text>
              </Box>
            </Box>
          </Box>
          <Box
            p="standard.xl"
            border="1px solid"
            borderColor="border.dividers"
            w="100%"
            borderRadius="4px"
          >
            <Flex
              borderRadius="999px"
              padding="standard.base"
              alignItems="center"
              gap="standard.xs"
              alignSelf="stretch"
              border="1px solid"
              p="4px"
              borderColor="border.dividers"
              mb="standard.lg"
            >
              <TabButton
                onSelect={() => setActiveTab(0)}
                isSelected={activeTab === 0}
                label="Wrap"
              />
              <TabButton
                onSelect={() => setActiveTab(1)}
                isSelected={activeTab === 1}
                label="Unwrap"
              />
            </Flex>
            <Flex mb="standard.md" gap="standard.sm" flexDirection="column">
              <Text variant="mediumStrong" color="content.default.default">
                {isUnwrap
                  ? "How much vSTRK do you want to unwrap?"
                  : "How much STRK do you want to wrap?"}
              </Text>
              <Input
                type="number"
                rightContent={
                  <Text color="content.support.default" variant="mediumStrong">
                    {!isUnwrap ? "STRK" : "vSTRK"}
                  </Text>
                }
                size="standard"
                placeholder="0"
                icon={<StarknetIcon />}
                value={starkToWrap > 0 ? starkToWrap : ""}
                onChange={(e) => {
                  if (isUnwrap) {
                    handleStarkToUnWrapAmount(e.target.value);
                  } else {
                    handleStarkToWrapAmount(e.target.value);
                  }
                }}
              />
            </Flex>

            <Box>
              <Slider
                onChange={handleSliderChange}
              />
            </Box>
            <Box mb="standard.sm">
              <Swap.Arrow py="standard.ms" />
            </Box>

            <Flex mb="standard.xl" gap="standard.sm" flexDirection="column">
              <Text variant="mediumStrong" color="content.default.default">
                Receiving
              </Text>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                px="standard.sm"
                py="standard.xs"
                border="1px solid"
                borderColor="border.dividers"
                borderRadius="4px"
                gap="standard.xs"
              >
                <Flex alignItems="center" gap="10px">
                  <Icon as={StarknetIcon} width="20px" height="20px" />
                  <Text variant="mediumStrong" color="content.default.default">
                    {starkToWrap}
                  </Text>
                </Flex>
                <Text color="content.support.default" variant="mediumStrong">
                  {isUnwrap ? "STRK" : "vSTRK"}
                </Text>
              </Flex>
            </Flex>
            <Box mb="standard.xl">
              <Flex gap="8px" alignItems="center">
                <Icon as={GasIcon} color="content.default.default" />
                <Text variant="mediumStrong" color="content.default.default">
                  Gas Fee
                </Text>
              </Flex>
            </Box>
            <Box w="100%">
              <Button
                variant="primary"
                w="100%"
                disabled={starkToWrap === 0 && starknetAddress}
                onClick={wrapTokens}
              >
                {activeTab === 0 ? "Wrap" : "Unwrap"}
              </Button>
            </Box>
          </Box>
        </Flex>
      </Box>
      <WrapModal
        isOpen={isWrapOpen}
        onClose={onWrapClose}
        isLoading={isWrapLoading}
        isSuccess={isWrapSuccess}
        starkToWrap={wrappedStark}
        error={wrapError}
        handleAddToWallet={handleAddToWallet}
        txHash={wrapTxHash}
        isArgentX={isArgentX}
      />
      <WrapModal
        isOpen={isUnwrapOpen}
        onClose={onUnwrapClose}
        isUnwrap
        isLoading={isUnwrapLoading}
        isSuccess={isUnwrapSuccess}
        starkToWrap={wrappedStark}
        error={unwrapError}
        handleAddToWallet={handleAddToWallet}
        txHash={unwrapTxHash}
        isArgentX={isArgentX}
      />
    </FormLayout>
  );
}

export const documentProps = {
  title: "Manage vSTRK",
} satisfies DocumentProps;
