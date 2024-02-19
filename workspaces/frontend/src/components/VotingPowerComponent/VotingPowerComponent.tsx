import React from "react";
import { Icon, Skeleton } from "@chakra-ui/react";
import { Text, Tooltip } from "@yukilabs/governance-components";
import { InfoCircleIcon } from "@yukilabs/governance-components/src/Icons";

const VotingPowerComponent = ({
  votingPower,
  unit = "STRK",
  isLarge = true,
  isLoading,
  isSmall,
}: {
  votingPower: any;
  unit?: string;
  isLoading?: boolean;
  isLarge?: boolean;
  isSmall?: boolean;
}) => {
  if (isSmall) {
    return (
      <>
        {isLoading ? (
          <Skeleton height="14px" width="50%" borderRadius="md" />
        ) : (
          <Text variant="small" color="content.support.default">
            {votingPower}
          </Text>
        )}
      </>
    );
  }
  const isCloseToZero = votingPower < 0.1 && votingPower > 0;
  return (
    <>
      {isLoading ? (
        <Skeleton height="24px" width="50%" borderRadius="md" />
      ) : (
        <Text color="content.accent.default" variant="mediumStrong">
          {isCloseToZero ? "~0" : votingPower} {unit}
          {isCloseToZero && (
            <Tooltip label={`${votingPower} ${unit}`}>
              <Icon color="#1A1523" ml="standard.xs" as={InfoCircleIcon} />
            </Tooltip>
          )}
        </Text>
      )}
    </>
  );
};

export default VotingPowerComponent;
