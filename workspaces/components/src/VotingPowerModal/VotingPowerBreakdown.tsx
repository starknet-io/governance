import { Box, Flex, Icon, Skeleton } from "@chakra-ui/react";
import { Text } from "../Text";
import { ExpandIcon, ThunderIcon } from "../Icons";
import { Button } from "../Button";
import { Link } from "../Link";
import { ethers } from "ethers";
import { navigate } from "vite-plugin-ssr/client/router";
import { InfoCircleIcon } from "src/Icons";
import { Tooltip } from "../Tooltip";
import { formatVotingPower } from "@yukilabs/governance-frontend/src/utils/helpers";
import VotingPowerComponent from "@yukilabs/governance-frontend/src/components/VotingPowerComponent/VotingPowerComponent";

type Props = {
  showBreakdown?: boolean;
  onToggleExpand?: () => void;
  votingPowerEth: bigint;
  votingPowerStark: bigint;
  hasEthWallet?: boolean;
  hasStarkWallet?: boolean;
  onClose?: () => void;
  isVotingPowerEthLoading: boolean;
  isVotingPowerStarknetLoading: boolean;
  balanceStark: any;
  balanceEth: any;
  showDetailedBalance?: boolean;
};

export const VotingPowerBreakdown = ({
  showBreakdown = false,
  onClose,
  onToggleExpand,
  votingPowerEth = 0n,
  votingPowerStark = 0n,
  hasEthWallet,
  hasStarkWallet,
  isVotingPowerEthLoading,
  isVotingPowerStarknetLoading,
  isStarknetBalanceLoading,
  balanceStark,
  balanceEth,
  showDetailedBalance = true,
}: Props) => {
  const totalVotingPower = formatVotingPower(
    (hasEthWallet ? votingPowerEth || 0 : 0) +
      (hasStarkWallet ? votingPowerStark || 0 : 0),
  );
  const votingPowerL1 = formatVotingPower(votingPowerEth);
  const votingPowerL2 = formatVotingPower(votingPowerStark);
  const totalValue = ethers.utils.commify(totalVotingPower);
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
            <VotingPowerComponent
              hasTooltip
              showBalanceText={false}
              votingPower={totalValue}
              unit="STRK"
              isLarge
              isLoading={!String(totalValue)}
            />
          </Box>
          {showBreakdown ? (
            <Icon as={ThunderIcon} fill="transparent" w="48px" h="48px" />
          ) : (
            <Button
              w="36px"
              h="36px"
              variant="secondary"
              // sx={{ background: "transparent" }}
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
            {hasStarkWallet && (
              <Box p="standard.sm">
                <Box>
                  <Text variant="small" color="content.support.default">
                    Starknet voting power{" "}
                    <Tooltip label="vSTRK is the voting token for Starknet.">
                      <InfoCircleIcon />
                    </Tooltip>
                  </Text>
                  <VotingPowerComponent
                    hasTooltip
                    showBalanceText={false}
                    votingPower={formatVotingPower(votingPowerL2 || 0)}
                    unit={"vSTRK"}
                    isLoading={isVotingPowerStarknetLoading}
                  />
                </Box>
                {showDetailedBalance && (
                  <VotingPowerComponent
                    isSmall
                    hasTooltip
                    votingPower={formatVotingPower(balanceStark?.balance || 0)}
                    unit={balanceStark?.symbol || "vSTRK"}
                    isLoading={isStarknetBalanceLoading}
                  />
                )}
              </Box>
            )}
            {hasEthWallet && (
              <Box p="standard.sm" mt="-12px">
                <Box>
                  <Text variant="small" color="content.support.default">
                    Ethereum voting power{" "}
                    <Tooltip label="vSTRK is the voting token for Starknet.">
                      <InfoCircleIcon />
                    </Tooltip>
                  </Text>
                  <VotingPowerComponent
                    votingPower={formatVotingPower(votingPowerL1 || 0)}
                    unit={"STRK"}
                    isLoading={isVotingPowerEthLoading}
                  />
                </Box>
                {!showBreakdown ? (
                  <VotingPowerComponent
                    hasTooltip
                    isSmall
                    votingPower={formatVotingPower(balanceEth?.balance || 0)}
                    unit={balanceEth?.symbol || "vSTRK"}
                  />
                ) : null}
              </Box>
            )}
          </Box>
          {hasStarkWallet && (
            <>
              {!showBreakdown ? (
                <Box p="standard.sm">
                  <Link
                    href="/manage-vstrk"
                    size="small"
                    color="content.links.default"
                  >
                    Manage vSTRK
                  </Link>
                </Box>
              ) : (
                <Box p="standard.sm">
                  <Button
                    size="condensed"
                    onClick={(e) => {
                      navigate("/manage-vstrk");
                      if (onClose) {
                        onClose();
                      }
                    }}
                  >
                    Manage vSTRK
                  </Button>
                </Box>
              )}
            </>
          )}
        </Flex>
      </Box>
    </Box>
  );
};
