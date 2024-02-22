import React from "react";
import { Icon, Skeleton } from "@chakra-ui/react";
import { Text, Tooltip } from "@yukilabs/governance-components";
import { InfoCircleIcon } from "@yukilabs/governance-components/src/Icons";

const VotingPowerComponent = ({
  votingPower,
  unit = "STRK",
  isLarge,
  isLoading,
  primary,
  isSmall,
  hasTooltip = false,
  showBalanceText = true,
}: {
  votingPower: any;
  unit?: string;
  isLoading?: boolean;
  isLarge?: boolean;
  isSmall?: boolean;
  primary?: boolean;
  hasTooltip?: boolean;
  showBalanceText?: boolean;
}) => {
  const isCloseToZero = votingPower < 0.01 && votingPower > 0;

  return (
    <>
      {isLoading ? (
        <Skeleton
          height={isSmall ? "14px" : "24px"}
          width="50%"
          borderRadius="md"
        />
      ) : (
        <Text
          variant={isSmall ? "small" : isLarge ? "largeStrong" : "mediumStrong"}
          color={
            isSmall && !primary
              ? "content.support.default"
              : "content.accent.default"
          }
        >
          {isCloseToZero && hasTooltip && (
            <Tooltip label={`${votingPower} ${unit}`}>
              ~0 {unit} {showBalanceText && "balance"}
            </Tooltip>
          )}
          {isCloseToZero && !hasTooltip && `~0 ${unit}`}

          {!isCloseToZero && !hasTooltip && (
            <>
              {votingPower} {unit}
            </>
          )}
          {!isCloseToZero && hasTooltip && (
            <>
              {votingPower} {unit}
              {showBalanceText && " balance"}
            </>
          )}
          {/* {isCloseToZero && (
            <Tooltip label={`${votingPower} ${unit}`}>
              <Icon color="#1A1523" ml="standard.xs" as={InfoCircleIcon} />
            </Tooltip>
          )} */}
        </Text>
      )}
    </>
  );
};

export default VotingPowerComponent;
