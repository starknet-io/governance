import React from "react";
import { Modal } from "../Modal";
import { Text } from "../Text";
import { Box, Flex } from "@chakra-ui/react";
import { VotingPowerBreakdown } from "./VotingPowerBreakdown";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  balanceEth: string;
  balanceStark: string;
  votingPowerEth: number;
  votingPowerStark: number;
  delegatedToL1: any;
  delegatedToL2: any;
};
export const VotingPowerModal = ({
  isOpen,
  onClose,
  title = "Voting power",
  votingPowerEth,
  votingPowerStark,
  balanceEth = 0,
  balanceStark = 0,
}: Props) => {
  return (
    <Modal
      maxHeight={"80%"}
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={onClose}
      title={"Voting Power"}
    >
      <VotingPowerBreakdown
        showBreakdown
        votingPowerEth={votingPowerEth}
        votingPowerStark={votingPowerStark}
      />
      <Box gap="standard.md">
        <Box>
          <Text variant="bodyMediumStrong">Starknet</Text>
          <Flex direction="column" gap="standard.xs" mt="standard.sm">
            <Flex>
              <Box width="50%">
                <Text variant="small" color="content.support.default">
                  STRK balance
                </Text>
              </Box>
              <Box width="50%">
                <Text variant="smallStrong" color="content.default.default">
                  {balanceStark}
                </Text>
              </Box>
            </Flex>
            <Flex>
              <Box width="50%">
                <Text variant="small" color="content.support.default">
                  vSTRK balance
                </Text>
              </Box>
              <Box width="50%">
                <Text variant="smallStrong" color="content.default.default">
                  0
                </Text>
              </Box>
            </Flex>
            <Flex>
              <Box width="50%">
                <Text variant="small" color="content.support.default">
                  Delegated To
                </Text>
              </Box>
              <Box width="50%">
                <Text variant="smallStrong" color="content.default.default">
                  -
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Box>
        <Box mt="standard.lg">
          <Text variant="bodyMediumStrong">Ethereum</Text>
          <Flex direction="column" gap="standard.xs" mt="standard.sm">
            <Flex>
              <Box width="50%">
                <Text variant="small" color="content.support.default">
                  STRK balance
                </Text>
              </Box>
              <Box width="50%">
                <Text variant="smallStrong" color="content.default.default">
                  {balanceEth}
                </Text>
              </Box>
            </Flex>
            <Flex>
              <Box width="50%">
                <Text variant="small" color="content.support.default">
                  Delegated To
                </Text>
              </Box>
              <Box width="50%">
                <Text variant="smallStrong" color="content.default.default">
                  -
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Modal>
  );
};
