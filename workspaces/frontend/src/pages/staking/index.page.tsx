import React, { useEffect, useState } from "react";
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
  StatusModal,
} from "@yukilabs/governance-components";
import { Box, Divider, Flex, Icon, useDisclosure } from "@chakra-ui/react";
import { useVotingPower } from "../../hooks/snapshotX/useVotingPower";
import { useBalanceData } from "../../utils/hooks";
import { useStarknetBalance } from "../../hooks/starknet/useStarknetBalance";
import { findMatchingWallet } from "../../utils/helpers";
import { WalletChainKey } from "../../utils/constants";
import { GasIcon, useUserWallets } from "@dynamic-labs/sdk-react-core";
import TabButton from "../../components/TabButton";
import * as Swap from "@yukilabs/governance-components/src/Swap/Swap";

export function Page() {
  const wallets = useUserWallets();

  const ethAddress =
    findMatchingWallet(wallets, WalletChainKey.EVM)?.address || undefined;
  const starknetAddress =
    findMatchingWallet(wallets, WalletChainKey.STARKNET)?.address || undefined;
  const { data: votingPowerEthereum } = useVotingPower({
    address: ethAddress,
  });

  const { data: votingPowerStarknet } = useVotingPower({
    address: starknetAddress,
  });

  const ethBalance = useBalanceData(ethAddress as `0x${string}`);
  const { balance: starknetBalance } = useStarknetBalance({ starknetAddress });
  const [sliderValue, setSliderValue] = useState(50);
  const [activeTab, setActiveTab] = useState(0);
  const [starkToWrap, setStarkToWrap] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");

  const wrapTokens = () => {
    onOpen();
    setDescription(`
            You're ${
              activeTab === 0 ? "wrapping" : "unwrapping"
            } ${starkToWrap} STRK.
            You'll receive ${starkToWrap} vSTRK`);
    setTitle(activeTab === 0 ? "Wrapping..." : "Unwrapping...");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setDescription(`Successfully received ${starkToWrap} vSTRK`);
      setTitle("All done!");
      setIsSuccess(true);
    }, 4000);
  };

  useEffect(() => {
    if (starknetBalance?.rawBalance) {
      setStarkToWrap(parseFloat(starknetBalance?.rawBalance) / 2);
    }
  }, [starknetBalance?.rawBalance]);
  const handleSliderChange = (val) => {
    setSliderValue(val);
    const rawBalance = parseFloat(starknetBalance?.rawBalance) || 0;
    setStarkToWrap(Math.floor((val / 100) * rawBalance));
  };
  const handleStarkToWrapAmount = (amount: number) => {
    const toSet = Math.min(amount, starknetBalance?.rawBalance);
    const rawBalance = parseFloat(starknetBalance?.rawBalance) || 0;
    setStarkToWrap(toSet);
    setSliderValue(Math.min(Math.floor((toSet / rawBalance) * 100), 100));
  };
  console.log(sliderValue, starkToWrap);
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
            description="Stake STRK for vSTRK to vote and delegate on the Starknet network in the Governance Hub."
            maxW={undefined}
            mb={0}
          />
        </Flex>
        <Flex alignItems="flex-start" justifyContent="space-between" gap="24px" direction={{ base: "column", md: "row" }}>
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
                  <Text variant="largeStrong" color="content.accent.default">
                    {new Intl.NumberFormat().format(
                      parseInt(votingPowerEthereum.toString()) +
                        parseInt(votingPowerStarknet.toString()),
                    )}
                  </Text>
                </Box>
              </Flex>
            </Box>
            <Box py="standard.sm" px="standard.md">
              <Box>
                <Text variant="small" color="content.support.default">
                  vSTRK on Starknet
                </Text>
                <Text color="content.accent.default" variant="mediumStrong">
                  0
                </Text>
              </Box>
              <Box mt="standard.sm">
                <Text variant="small" color="content.support.default">
                  STRK on Starknet
                </Text>
                <Text color="content.accent.default" variant="mediumStrong">
                  {starknetBalance?.balance || 0}{" "}
                  {starknetBalance?.symbol || "STRK"}
                </Text>
              </Box>
              <Divider my="standard.sm" />
              <Box mt="standard.sm">
                <Text variant="small" color="content.support.default">
                  STRK on Ethereum
                </Text>
                <Text color="content.accent.default" variant="mediumStrong">
                  {new Intl.NumberFormat().format(ethBalance.balance)}{" "}
                  {ethBalance.symbol}
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
            <Heading variant="h3" mb="24px" textAlign="center">
              Starknet wallet balance
            </Heading>
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
                How much STRK do you want to stake?
              </Text>
              <Input
                type="number"
                rightContent={
                  <Text color="content.support.default" variant="mediumStrong">
                    STRK
                  </Text>
                }
                size="standard"
                placeholder="0"
                icon={<StarknetIcon />}
                value={starkToWrap > 0 ? starkToWrap : ""}
                onChange={(e) => {
                  handleStarkToWrapAmount(e.target.value);
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
              >
                <Flex alignItems="center" gap="10px">
                  <Icon as={StarknetIcon} width="20px" height="20px" />
                  <Text variant="mediumStrong" color="content.default.default">
                    {starkToWrap}
                  </Text>
                </Flex>
                <Text color="content.support.default" variant="mediumStrong">
                  STRK
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
                disabled={starkToWrap === 0}
                onClick={wrapTokens}
              >
                {activeTab === 0 ? "Wrap" : "Unwrap"}
              </Button>
            </Box>
          </Box>
        </Flex>
      </Box>
      <StatusModal
        isOpen={isOpen}
        isPending={isLoading}
        isSuccess={isSuccess}
        isFail={false}
        onClose={() => {
          onClose();
        }}
        description={description}
        title={title}
      />
    </FormLayout>
  );
}

export const documentProps = {
  title: "Manage vSTRK",
} satisfies DocumentProps;
