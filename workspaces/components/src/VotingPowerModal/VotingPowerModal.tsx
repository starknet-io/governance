import React from "react";
import { Modal } from "../Modal";
import { Text } from "../Text";
import { Box, Flex, Icon, Stack } from "@chakra-ui/react";
import { Button } from "../Button";
import { ThunderIcon } from "../Icons";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  votingPowerL1: number;
  votingPowerL2: number;
  delegatedToL1: any;
  delegatedToL2: any;
};
export const VotingPowerModal = ({
  isOpen,
  onClose,
  title = "Voting power",
  votingPowerL1,
  votingPowerL2,
}: Props) => {
  return (
    <Modal
      maxHeight={"80%"}
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={onClose}
      title={"Voting Power"}
    >
      <Box gap="standard.md">
        <Box
          border="1px solid"
          borderColor="border.dividers"
          borderRadius="4px"
        >
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
                  3.4M
                </Text>
              </Box>
              <Icon as={ThunderIcon} fill="transparent" w="48px" h="48px" />
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
                    0 vSTRK
                  </Text>
                </Box>
                <Box p="standard.sm">
                  <Text variant="small" color="content.support.default">
                    Ethereum voting power
                  </Text>
                  <Text color="content.accent.default" variant="mediumStrong">
                    3.4M STRK
                  </Text>
                </Box>
              </Box>
              <Box p="standard.sm">
                <Button size="condensed">Manage vSTRK</Button>
              </Box>
            </Flex>
          </Box>
        </Box>
        <Box mt="standard.lg">
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
                  0
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
      </Box>
    </Modal>
  );
};
