import { Modal } from "../Modal";
import { Text } from "../Text";
import { Box, Flex, Link, Skeleton, Icon } from "@chakra-ui/react";
import { VotingPowerBreakdown } from "./VotingPowerBreakdown";
import { truncateAddress } from "../utils";
import { Tooltip } from "../Tooltip";
import { CopyToClipboard } from "../CopyToClipboard";
import { getChecksumAddress } from "starknet";
import { InfoCircleIcon } from "src/Icons";
import VotingPowerComponent from "@yukilabs/governance-frontend/src/components/VotingPowerComponent/VotingPowerComponent";
import { formatVotingPower } from "@yukilabs/governance-frontend/src/utils/helpers";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  balanceEth: any;
  isBalanceEthFetched: boolean;
  balanceStark: any;
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
  isVotingPowerEthLoading: boolean;
  isVotingPowerStarknetLoading: boolean;
};

const DelegationComponent = ({
  delegatedTo,
  delegatedToName,
  selfDelegated,
}: {
  delegatedTo: any;
  delegatedToName: string | undefined;
  selfDelegated?: boolean;
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
                <>
                  {truncateAddress(delegatedToName || "")}{" "}
                  {selfDelegated ? " (you)" : ""}
                </>
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
                  <Text>
                    {truncateAddress(delegatedTo?.address || "")}
                    {selfDelegated ? " (you)" : ""}
                  </Text>
                </Tooltip>
                <CopyToClipboard text={delegatedTo?.address} />
              </Flex>
            ) : delegatedTo &&
              delegatedTo.length &&
              delegatedTo !== "0x0000000000000000000000000000000000000000" &&
              delegatedTo !== "0x00" ? (
              <Flex>
                <Tooltip label={delegatedTo}>
                  <Text>
                    {truncateAddress(delegatedTo || "")}
                    {selfDelegated ? " (you)" : ""}
                  </Text>
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
  balanceEth,
  balanceStark,
  balanceVStark,
  isvSTRKBalanceLoading,
  isStarknetBalanceLoading,
  selfDelegatedL1,
  selfDelegatedL2,
  delegatedToL1,
  delegatedToL2,
  delegatedToL1Name,
  delegatedToL2Name,
  delegatedToL1Loading,
  delegatedToL2Loading,
  isVotingPowerEthLoading,
  isVotingPowerStarknetLoading,
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
        isVotingPowerEthLoading={isVotingPowerEthLoading}
        isVotingPowerStarknetLoading={isVotingPowerStarknetLoading}
        balanceStark={balanceStark}
        balanceEth={balanceEth}
      />
      <Box gap="standard.md">
        {hasStarkWallet && (
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
                  <VotingPowerComponent
                    votingPower={formatVotingPower(balanceStark?.balance)}
                    isLoading={isStarknetBalanceLoading}
                    unit={balanceStark?.symbol}
                    isSmall
                    primary
                  />
                </Box>
              </Flex>
              <Flex>
                <Box width="50%">
                  <Text variant="small" color="content.support.default">
                    vSTRK balance
                    <Tooltip label="Tooltip">
                      <Icon
                        color="#1A1523"
                        ml="standard.xs"
                        as={InfoCircleIcon}
                      />
                    </Tooltip>
                  </Text>
                </Box>
                <Box width="50%">
                  <VotingPowerComponent
                    votingPower={formatVotingPower(balanceVStark?.balance)}
                    isLoading={isvSTRKBalanceLoading}
                    unit={balanceVStark?.symbol}
                    isSmall
                    primary
                  />
                </Box>
              </Flex>
              <Flex>
                <Box width="50%">
                  <Flex direction="row">
                    <svg
                      width="19"
                      height="11"
                      viewBox="0 0 19 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        id="Rectangle 5597"
                        d="M1 0V2C1 6.41828 4.58172 10 9 10H19"
                        stroke="#DCDBDD"
                      />
                    </svg>
                    <Text
                      variant="small"
                      color="content.support.default"
                      ml="8px"
                    >
                      Delegated to
                    </Text>
                  </Flex>
                </Box>
                {!delegatedToL2Loading ? (
                  <DelegationComponent
                    delegatedTo={delegatedToL2}
                    delegatedToName={delegatedToL2Name}
                    selfDelegated={selfDelegatedL2}
                  />
                ) : (
                  <Box width="50%">
                    <Skeleton height="16px" width="50%" borderRadius="md" />
                  </Box>
                )}
              </Flex>
            </Flex>
          </Box>
        )}
        {hasEthWallet && (
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
                  <VotingPowerComponent
                    votingPower={formatVotingPower(balanceEth?.balance)}
                    isLoading={!isBalanceEthFetched}
                    unit={balanceEth?.symbol}
                    isSmall
                    primary
                  />
                </Box>
              </Flex>
              <Flex>
                <Box width="50%">
                  <Flex direction="row">
                    <svg
                      width="19"
                      height="11"
                      viewBox="0 0 19 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        id="Rectangle 5597"
                        d="M1 0V2C1 6.41828 4.58172 10 9 10H19"
                        stroke="#DCDBDD"
                      />
                    </svg>
                    <Text
                      variant="small"
                      color="content.support.default"
                      ml="8px"
                    >
                      Delegated to
                    </Text>
                  </Flex>
                </Box>
                {!delegatedToL1Loading ? (
                  <DelegationComponent
                    delegatedTo={delegatedToL1}
                    delegatedToName={delegatedToL1Name}
                    selfDelegated={selfDelegatedL1}
                  />
                ) : (
                  <Box width="50%">
                    <Skeleton height="16px" width="50%" borderRadius="md" />
                  </Box>
                )}
              </Flex>
            </Flex>
          </Box>
        )}
      </Box>
    </Modal>
  );
};
