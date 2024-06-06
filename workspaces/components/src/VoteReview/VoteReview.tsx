import { Button } from "../Button";
import {
  EthereumIcon,
  StarknetIcon,
  VoteAbstainIcon,
  VoteAgainstIcon,
  VoteForIcon,
} from "src/Icons";
import { Text } from "src/Text";
import { formatVotesAmount } from "src/utils";
import { Flex, Icon } from "@chakra-ui/react";
import { useEffect, useState } from "react";

type Props = {
  choice: number;
  voteCount: number;
  setWalletCallback: () => Promise<any>;
  isSelected?: boolean;
  isStarknet?: boolean;
  startTimestamp?: number; // start time as a Unix timestamp
};

export const VoteReview = ({
  voteCount = 0,
  choice,
  setWalletCallback,
  isSelected,
  isStarknet,
  startTimestamp,
}: Props) => {
  const [countdown, setCountdown] = useState(0);
  const formattedCount = formatVotesAmount(voteCount);

  useEffect(() => {
    if (startTimestamp && !isStarknet) {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const countdownSeconds = startTimestamp + 900 - currentTimestamp;
      setCountdown(countdownSeconds);

      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          const newCountdown = prevCountdown - 1;
          console.log("Updated Countdown:", newCountdown);
          return newCountdown;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [startTimestamp, isStarknet]);

  console.log("Final Countdown State:", countdown);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  const ethNotStartedText = `starts in: ${minutes}:${
    seconds < 10 ? `0${seconds}` : seconds
  }`;

  return (
    <Button
      variant="fill"
      bg="surface-forms-default"
      p="16px"
      isActive={isSelected}
      onClick={setWalletCallback}
      gap="standard.xs"
      border="1px solid"
      borderColor="border.forms"
      borderRadius="8px"
      boxShadow="0px 1px 2px 0px rgba(0, 0, 0, 0.04)"
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Flex flexDirection="column" alignItems="flex-start">
          <Text color="content.support.default" variant="smallStrong">
            {isStarknet ? "Starknet" : "Ethereum"}
          </Text>
          <Flex alignItems="center" gap="1">
            <Text variant="small" color="content.accent.default">
              Voting
            </Text>
            {countdown > 0 && !isStarknet ? (
              <Text variant="small" color="content.accent.default">
                {ethNotStartedText}
              </Text>
            ) : (
              <>
                {choice === 1 && <VoteForIcon color="#44D095" boxSize="20px" />}
                {choice === 2 && (
                  <VoteAgainstIcon color="#EC796B" boxSize="20px" />
                )}
                {choice === 3 && (
                  <VoteAbstainIcon color="#4A4A4F" boxSize="20px" />
                )}
                <Text variant="small" color="content.accent.default">
                  with {formattedCount} votes
                </Text>
              </>
            )}
          </Flex>
        </Flex>
        <Icon as={isStarknet ? StarknetIcon : EthereumIcon} />
      </Flex>
    </Button>
  );
};
