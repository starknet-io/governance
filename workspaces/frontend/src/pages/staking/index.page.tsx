import React, { useState, useEffect } from "react";
import { DocumentProps } from "../../renderer/types";
import { FormLayout } from "../../components/FormsCommon/FormLayout";
import {
  Heading,
  PageTitle,
  Text,
  Slider,
  Button
} from "@yukilabs/governance-components";
import { Box, Divider, Flex } from "@chakra-ui/react";
import { useVotingPower } from "../../hooks/snapshotX/useVotingPower";
import { useBalanceData } from "../../utils/hooks";
import { useStarknetBalance } from "../../hooks/starknet/useStarknetBalance";
import { findMatchingWallet } from "../../utils/helpers";
import { WalletChainKey } from "../../utils/constants";
import { useUserWallets } from "@dynamic-labs/sdk-react-core";

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
  const [tabClicked, setTabClicked] = useState(0);
  const handleSliderChange = (val) => {
    setSliderValue(val);
  }
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
            <Box>
              <Flex
                padding="standard.base"
                alignItems="center"
                gap="standard.xs"
                alignSelf="stretch"
              >
                <Button
                  variant="primary"
                  size="condensed"
                  sx={{
                    display: "flex",
                    minWidth: "48px",
                    py: "4px",
                    px: "16px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "standard.base",
                    flex: "1 0 0",
                    borderRadius: "999px",
                    background: tabClicked === 1 ? "transparent" : "surface.forms.selected",
                    height: "28px",
                    minHeight: "28px",
                    color: tabClicked === 1 ? "content.support.default" : "content.support.hover",
                    fontSize: "12px",
                    _hover: {
                      color: "content.support.hover",
                      background: tabClicked === 1 ? "transparent" : "surface.forms.selected",
                    }
                  }}
                  onClick={() => setTabClicked(0)}
                >Wrap</Button>
                <Button
                  variant="primary"
                  size="condensed"
                  sx={{
                    display: "flex",
                    minWidth: "48px",
                    py: "4px",
                    px: "16px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "standard.base",
                    flex: "1 0 0",
                    borderRadius: "999px",
                    background: tabClicked === 0 ? "transparent" : "surface.forms.selected",
                    height: "28px",
                    minHeight: "28px",
                    color: tabClicked === 0 ? "content.support.default" : "content.support.hover",
                    fontSize: "12px",
                    _hover: {
                      color: "content.support.hover",
                      background: tabClicked === 0 ? "transparent" : "surface.forms.selected",
                    }
                  }}
                  onClick={() => setTabClicked(1)}
                >Unwrap</Button>
              </Flex>
              <Box p="standard.md">
                <Slider value={sliderValue} onChange={handleSliderChange} />
              </Box>
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
