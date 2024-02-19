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
  Banner,
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
import { findMatchingWallet, formatVotingPower } from "../../utils/helpers";
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
import { ethers } from "ethers";
import VotingPowerComponent from "../../components/VotingPowerComponent/VotingPowerComponent";

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
                  href={`https://starkscan.co/tx/${txHash || ""}`}
                  variant="secondary"
                  size="small"
                  color="content.support.default"
                >
                  Review transaction details{" "}
                </Link>
              </Flex>
            </>
          )}
        </Flex>
      </Flex>
      {isSuccess ? (
        <Modal.Footer>
          {!isUnwrap ? (
            <Button
              type="button"
              variant="primary"
              size="standard"
              mb="standard.sm"
              onClick={() => {
                navigate("/delegates");
              }}
              width="100%"
            >
              Continue to Delegate
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="standard"
              onClick={onClose}
              width="100%"
            >
              Close
            </Button>
          )}
        </Modal.Footer>
      ) : null}
    </Modal>
  );
};

const RECEIVING_AMOUNT_SUBTRACT = 0.00001;

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
  const { balance: ethBalance, symbol: ethBalanceSymbol } = useBalanceData(
    ethAddress as `0x${string}`,
  );
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

  const formatNumber = (value, rawBalance) => {
    if (rawBalance < 1) {
      return value.toFixed(6); // up to 6 decimal places for values less than 1
    } else if (rawBalance < 10) {
      return value.toFixed(2); // up to 2 decimal places for values less than 10
    } else {
      return value.toFixed(1); // 1 decimal place for larger values
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
      const toSet = (val / 100) * rawBalance;
      setStarkToWrap(formatNumber(toSet, rawBalance));
    } else {
      const rawBalance = starknetBalance?.rawBalance
        ? Math.max(
            parseFloat(starknetBalance?.rawBalance) - RECEIVING_AMOUNT_SUBTRACT,
            0,
          )
        : 0;
      const toSet = (val / 100) * rawBalance;
      setStarkToWrap(formatNumber(toSet, rawBalance));
    }
  };
  const handleStarkToWrapAmount = (amount: number) => {
    const toSet = Math.min(
      amount,
      starknetBalance?.rawBalance - RECEIVING_AMOUNT_SUBTRACT,
    );
    const rawBalance = starknetBalance?.rawBalance
      ? Math.max(
          parseFloat(starknetBalance?.rawBalance) - RECEIVING_AMOUNT_SUBTRACT,
          0,
        )
      : 0;
    setStarkToWrap(toSet);
    setSliderValue(Math.min(Math.floor((toSet / rawBalance) * 100), 100));
  };
  const handleStarkToUnWrapAmount = (amount: number) => {
    const toSet = Math.min(amount, vSTRKBalance?.rawBalance);
    const rawBalance = parseFloat(vSTRKBalance?.rawBalance) || 0;
    setStarkToWrap(toSet);
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

  const totalVotingPower = formatVotingPower(
    (ethAddress ? votingPowerEthereum || 0 : 0) +
      (starknetAddress ? votingPowerStarknet || 0 : 0),
  );
  const totalValue = ethers.utils.commify(totalVotingPower);

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
                  <VotingPowerComponent
                    votingPower={totalValue}
                    unit=""
                    isLarge
                    isLoading={
                      isVotingPowerEthereumLoading ||
                      isVotingPowerStarknetLoading
                    }
                  />
                </Box>
              </Flex>
            </Box>
            <Box py="standard.sm" px="standard.md">
              <Box>
                <Text variant="small" color="content.support.default">
                  vSTRK on Starknet
                </Text>
                <VotingPowerComponent
                  votingPower={formatVotingPower(vSTRKBalance?.balance || 0)}
                  unit={vSTRKBalance?.symbol}
                  isLoading={isvSTRKBalanceLoading}
                />
              </Box>
              <Box mt="standard.sm">
                <Text variant="small" color="content.support.default">
                  STRK on Starknet
                </Text>
                <VotingPowerComponent
                  votingPower={formatVotingPower(starknetBalance?.balance || 0)}
                  unit={starknetBalance?.symbol}
                  isLoading={isStarknetBalanceLoading}
                />
              </Box>
              <Divider my="standard.sm" />
              <Box mt="standard.sm">
                <Text variant="small" color="content.support.default">
                  STRK on Ethereum
                </Text>
                <VotingPowerComponent
                  votingPower={
                    !ethBalance ? 0 : formatVotingPower(ethBalance || 0)
                  }
                  unit={"STRK"}
                />
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
                value={starkToWrap >= 0 ? starkToWrap : ""}
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
                sliderValue={sliderValue}
                setSliderValue={handleSliderChange}
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
            {/*
            <Box mb="standard.xl">
              <Flex gap="8px" alignItems="center">
                <Icon as={GasIcon} color="content.default.default" />
                <Text variant="mediumStrong" color="content.default.default">
                  Gas Fee
                </Text>
              </Flex>
            </Box>
            */}
            {sliderValue === 100 && !isUnwrap && starknetWallet?.address ? (
              <Box>
                <Banner
                  mb="standard.md"
                  label={
                    `You will retain ${RECEIVING_AMOUNT_SUBTRACT} STRK from your max amount for future\n` +
                    `transaction gas costs.`
                  }
                />
              </Box>
            ) : null}
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
