import { Box, Flex, Icon } from "@chakra-ui/react";
import { Text } from "../Text";
import { ExpandIcon, ThunderIcon } from "../Icons";
import { Button } from "../Button";
import React from "react";
import { Link } from "../Link";
import { ethers } from "ethers";

type Props = {
  showBreakdown?: boolean;
  onToggleExpand?: () => void;
  votingPowerEth: number;
  votingPowerStark: number;
};

export const VotingPowerBreakdown = ({
  showBreakdown = false,
  onToggleExpand,
  votingPowerEth = 0,
  votingPowerStark = 0,
}: Props) => {
  return (
    <Box border="1px solid" borderColor="border.dividers" borderRadius="4px">
      <Box
        borderBottom="1px solid"
        borderColor="border.dividers"
        p="standard.sm"
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
              {ethers.utils.commify(votingPowerEth + votingPowerStark)}
            </Text>
          </Box>
          {showBreakdown ? (
            <Icon as={ThunderIcon} fill="transparent" w="48px" h="48px" />
          ) : (
            <Button
              w="36px"
              h="36px"
              variant="secondary"
              sx={{ background: "transparent" }}
              onClick={() => {
                if (onToggleExpand) {
                  onToggleExpand();
                }
              }}
            >
              <Icon as={ExpandIcon} />
            </Button>
          )}
        </Flex>
      </Box>
      <Box>
        <Flex alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Box p="standard.sm">
              <Text variant="small" color="content.support.default">
                Starknet voting power
              </Text>
              <Text color="content.accent.default" variant="mediumStrong">
                {new Intl.NumberFormat().format(votingPowerStark)}
              </Text>
            </Box>
            <Box p="standard.sm">
              <Text variant="small" color="content.support.default">
                Ethereum voting power
              </Text>
              <Text color="content.accent.default" variant="mediumStrong">
                {new Intl.NumberFormat().format(votingPowerEth)}
              </Text>
            </Box>
          </Box>
          {!showBreakdown ? (
            <Box p="standard.sm">
              <Link href="/staking" size="small" color="content.links.default">
                Manage vSTRK
              </Link>
            </Box>
          ) : (
            <Box p="standard.sm">
              <Button size="condensed">Manage vSTRK</Button>
            </Box>
          )}
        </Flex>
      </Box>
    </Box>
  );
};
