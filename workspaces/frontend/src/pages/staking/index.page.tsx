import React, { useState } from "react";
import { DocumentProps } from "../../renderer/types";
import { FormLayout } from "../../components/FormsCommon/FormLayout";
import {
  Heading,
  PageTitle,
  Text,
  Slider,
} from "@yukilabs/governance-components";
import { Box, Divider, Flex, Icon } from "@chakra-ui/react";
import { useVotingPower } from "../../hooks/snapshotX/useVotingPower";
import { useBalanceData } from "../../utils/hooks";
import { useStarknetBalance } from "../../hooks/starknet/useStarknetBalance";
import { findMatchingWallet } from "../../utils/helpers";
import { WalletChainKey } from "../../utils/constants";
import { GasIcon, useUserWallets } from "@dynamic-labs/sdk-react-core";
import TabButton from "../../components/TabButton";

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
  const handleSliderChange = (val) => {
    setSliderValue(val);
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
            description="Stake STRK for vSTRK to vote and delegate on the Starknet network in the Governance Hub."
            maxW={undefined}
            mb={0}
          />
        </Flex>
        <Flex alignItems="flex-start" justifyContent="space-between" gap="24px">
          <Box
            border="1px solid"
            borderColor="border.dividers"
            borderRadius="4px"
            w="238px"
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
              mb="standard.md"
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
            <Box mb="standard.md">
              <Text variant="mediumStrong" color="content.default.default">
                How much STRK do you want to stake?
              </Text>
            </Box>

            <Box mb="standard.md">
              <Slider value={sliderValue} onChange={handleSliderChange} />
            </Box>
            <Box>
              <Flex gap="8px" alignItems="center">
                <Icon as={GasIcon} color="content.default.default" />
                <Text variant="mediumStrong" color="content.default.default">
                  Gas Fee
                </Text>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Box>
    </FormLayout>
  );
}

export const documentProps = {
  title: "Manage vSTRK",
} satisfies DocumentProps;
