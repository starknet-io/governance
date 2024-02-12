import { Modal } from "../Modal";
import { Text } from "../Text";
import { Box, Flex, Link, Skeleton } from "@chakra-ui/react";
import { VotingPowerBreakdown } from "./VotingPowerBreakdown";
import { truncateAddress } from "../utils";
import { Tooltip } from "../Tooltip";
import { CopyToClipboard } from "../CopyToClipboard";
import { getChecksumAddress } from "starknet";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  balanceEth: string;
  isBalanceEthFetched: boolean;
  balanceStark: string;
  votingPowerEth: number;
  votingPowerStark: number;
  delegatedToL1: any;
  hasEthWallet?: boolean;
  hasStarkWallet?: boolean;
  delegatedToL2: any;
  delegatedToL1Name: string | undefined;
  delegatedToL2Name: string | undefined;
  delegatedToL1Loading: boolean;
  delegatedToL2Loading: boolean;
};

const DelegationComponent = ({
  delegatedTo,
  delegatedToName,
}: {
  delegatedTo: any;
  delegatedToName: string | undefined;
}) => {
  return (
    <Box width="50%">
      <Text variant="smallStrong" color="content.default.default">
        {delegatedTo?.delegationStatement ? (
          <Flex>
            <Link
              fontSize="small"
              fontWeight="normal"
              href={`/delegates/profile/${delegatedTo?.delegationStatement?.id}`}
            >
              {delegatedToName ? (
                truncateAddress(delegatedToName || "")
              ) : (
                <Tooltip label={delegatedTo?.address || ""}>
                  {truncateAddress(delegatedTo?.address || "")}
                </Tooltip>
              )}
            </Link>
            <CopyToClipboard text={delegatedTo?.address} />
          </Flex>
        ) : (
          <>
            {delegatedTo?.address ? (
              <Flex>
                <Tooltip label={delegatedTo?.address}>
                  <Text>{truncateAddress(delegatedTo?.address || "")}</Text>
                </Tooltip>
                <CopyToClipboard text={delegatedTo?.address} />
              </Flex>
            ) : delegatedTo &&
              delegatedTo.length &&
              delegatedTo !== "0x0000000000000000000000000000000000000000" ? (
              <Flex>
                <Tooltip label={delegatedTo}>
                  <Text>{truncateAddress(delegatedTo || "")}</Text>
                </Tooltip>
                <CopyToClipboard text={delegatedTo} />
              </Flex>
            ) : (
              "-"
            )}
          </>
        )}
      </Text>
    </Box>
  );
};
export const VotingPowerModal = ({
  isOpen,
  onClose,
  title = "Voting power",
  votingPowerEth,
  votingPowerStark,
  hasEthWallet,
  hasStarkWallet,
  isBalanceEthFetched,
  balanceEth = 0,
  balanceStark = 0,
  balanceVStark = 0,
  delegatedToL1,
  delegatedToL2,
  delegatedToL1Name,
  delegatedToL2Name,
  delegatedToL1Loading,
  delegatedToL2Loading
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
        onClose={onClose}
        showBreakdown
        hasEthWallet={hasEthWallet}
        hasStarkWallet={hasStarkWallet}
        votingPowerEth={votingPowerEth}
        votingPowerStark={votingPowerStark}
      />
      <Box gap="standard.md">
        {hasStarkWallet && (
          <Box>
            <Text variant="bodyMediumStrong">Starknet</Text>
            <Flex direction="column" gap="standard.xs" mt="standard.sm">
              {balanceStark ? <Flex>
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
              </Flex> :
              <Flex>
                <Box width="50%">
                  <Skeleton height="24px" width="50%" borderRadius="md" />
                </Box>
                <Box width="50%">
                  <Skeleton height="24px" width="30%" borderRadius="md" />
                </Box>
              </Flex>}
              <Flex>
                <Box width="50%">
                  <Text variant="small" color="content.support.default">
                    vSTRK balance
                  </Text>
                </Box>
                <Box width="50%">
                  <Text variant="smallStrong" color="content.default.default">
                    {balanceVStark}
                  </Text>
                </Box>
              </Flex>
              {!delegatedToL2Loading ? <Flex>
                <Box width="50%">
                  <Text variant="smallStrong" color="content.support.default">
                    Delegated to
                  </Text>
                </Box>
                <DelegationComponent
                  delegatedTo={delegatedToL2}
                  delegatedToName={delegatedToL2Name}
                />
              </Flex> :
              <Flex>
                <Box width="50%">
                  <Skeleton height="16px" width="50%" borderRadius="md" />
                </Box>
                  <Skeleton height="16px" width="30%" borderRadius="md" />
              </Flex>}
            </Flex>
          </Box>
        )}
        {hasEthWallet && (
          <Box mt="standard.lg">
            <Text variant="bodyMediumStrong">Ethereum</Text>
            <Flex direction="column" gap="standard.xs" mt="standard.sm">
              {isBalanceEthFetched ? <Flex>
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
              </Flex> :
              <Flex>
                <Box width="50%">
                  <Skeleton height="16px" width="50%" borderRadius="md" />
                </Box>
                <Box width="50%">
                  <Skeleton height="16px" width="30%" borderRadius="md" />
                </Box>
              </Flex>}
              {!delegatedToL1Loading ? <Flex>
                <Box width="50%">
                  <Text variant="smallStrong" color="content.support.default">
                    Delegated to
                  </Text>
                </Box>
                <DelegationComponent
                  delegatedTo={delegatedToL1}
                  delegatedToName={delegatedToL1Name}
                />
              </Flex> :
              <Flex>
                <Box width="50%">
                  <Skeleton height="16px" width="50%" borderRadius="md" />
                </Box>
                <Box width="50%">
                  <Skeleton height="16px" width="30%" borderRadius="md" />
                </Box>
              </Flex>}
            </Flex>
          </Box>
        )}
      </Box>
    </Modal>
  );
};
