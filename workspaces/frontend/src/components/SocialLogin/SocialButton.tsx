import { Flex, Icon } from "@chakra-ui/react";
import { Button, SummaryItems, Text } from "@yukilabs/governance-components";
import {
  DiscordIcon,
  DiscourseIcon,
  TwitterIcon,
  TelegramIcon,
} from "@yukilabs/governance-components/src/Icons";

export const SocialButton = ({
  username,
  onConnect,
  onDisconnect,
  isError,
  isLoading,
  provider,
}: {
  username: string;
  onConnect: () => void;
  onDisconnect: () => void;
  isLoading?: boolean;
  isError?: boolean;
  provider: "discord" | "twitter" | "telegram" | "discourse";
}) => {
  if (isError) {
    return <div>Error fetching {provider} info...</div>;
  }
  if (isLoading) {
    return (
      <SummaryItems.Socials
        label={provider}
        value={undefined}
        isLoading={true}
      />
    );
  }

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Flex gap="standard.xs" alignItems="center">
        <Icon
          as={
            provider === "twitter"
              ? TwitterIcon
              : provider === "discourse"
              ? DiscourseIcon
              : provider === "discord"
              ? DiscordIcon
              : provider === "telegram"
              ? TelegramIcon
              : TwitterIcon
          }
          w={"20px"}
          h={"20px"}
          color="#4A4A4F"
        />
        <Text variant="bodySmall">Discord {username && <span> - </span>}</Text>
        {username && <Text variant="bodySmallStrong">{username}</Text>}
      </Flex>
      {username ? (
        <Button
          aria-label="Disconnect"
          variant="unstyled"
          onClick={onDisconnect}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Group">
              <g id="Group_2">
                <path
                  id="Path"
                  d="M11.5 8.99992H1.5"
                  stroke="#C8C7CB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Path_2"
                  d="M2.28918 12.3333C3.51668 14.8008 6.05669 16.5 9.00002 16.5C13.1425 16.5 16.5 13.1425 16.5 9C16.5 4.8575 13.1425 1.5 9.00002 1.5C6.05669 1.5 3.51668 3.19917 2.28918 5.66667"
                  stroke="#C8C7CB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Path_3"
                  d="M9 6.5L11.5 9L9 11.5"
                  stroke="#C8C7CB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </g>
          </svg>
        </Button>
      ) : (
        <Button variant="outline" onClick={onConnect}>
          Connect
        </Button>
      )}
    </Flex>
  );
};
