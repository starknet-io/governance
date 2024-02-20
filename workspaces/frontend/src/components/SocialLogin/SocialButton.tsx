import { Box, Flex, Icon } from "@chakra-ui/react";
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
  readonly,
}: {
  username?: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  isLoading?: boolean;
  isError?: boolean;
  readonly?: boolean;
  provider: "discord" | "twitter" | "telegram" | "discourse";
}) => {
  if (isError) {
    return (
      <Text variant="mediumStrong">Error fetching {provider} info...</Text>
    );
  }
  const label =
    provider === "twitter"
      ? ""
      : provider === "discord"
      ? ""
      : provider === "telegram"
      ? ""
      : provider === "discourse"
      ? ""
      : "";
  if (isLoading) {
    return (
      <SummaryItems.Socials
        label={undefined}
        value={undefined}
        isLoading={true}
      />
    );
  }

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Flex gap="standard.xs" alignItems="center">
        {username && !readonly ? (
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
        ) : <Text variant="bodySmall">
        {label} {username && <span> - </span>}
      </Text>}
        {username && <Text variant="bodySmallStrong">@{username}</Text>}
      </Flex>
      {username && !readonly ? (
        <Button
          aria-label="Disconnect"
          variant="outline"
          size="condensed"
          onClick={onDisconnect}
          display="flex"
          justifyContent="center"
          sx={{
            color: "content.default.default",
            gap: "standard.xs",
            "& > svg": {
              fill: "content.default.default",
            },
            _hover: {
              fill: "content.default.hover",
              color: 'content.default.hover',
              "& > svg": {
                fill: "#1A1523"
              }
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M5.72692 5.22712C7.6574 3.29663 10.5607 2.71913 13.083 3.7639C15.6053 4.80867 17.2499 7.26997 17.2499 10.0001C17.2499 12.7302 15.6053 15.1915 13.083 16.2363C10.5607 17.281 7.6574 16.7035 5.72692 14.7731C5.43402 14.4802 4.95915 14.4802 4.66626 14.7731C4.37336 15.066 4.37336 15.5408 4.66626 15.8337C7.02574 18.1932 10.5742 18.899 13.657 17.6221C16.7398 16.3452 18.7499 13.3369 18.7499 10.0001C18.7499 6.66328 16.7398 3.65503 13.657 2.37808C10.5742 1.10114 7.02574 1.80697 4.66626 4.16646C4.37336 4.45935 4.37336 4.93423 4.66626 5.22712C4.95915 5.52001 5.43402 5.52001 5.72692 5.22712ZM9.96959 6.55312C10.2625 6.26023 10.7374 6.26023 11.0302 6.55312L14.1666 10.0001C14.1666 10.199 14.0876 10.3898 13.9469 10.5305L11.0302 13.4471C10.7374 13.74 10.2625 13.74 9.96959 13.4471C9.6767 13.1542 9.6767 12.6794 9.96959 12.3865L11.6059 10.7501H3.83325C3.41904 10.7501 3.08325 10.4143 3.08325 10.0001C3.08325 9.58591 3.41904 9.25012 3.83325 9.25012H11.6059L9.96959 7.61378C9.6767 7.32089 9.6767 6.84602 9.96959 6.55312Z" fill="currentColor"/>
          </svg>
          Disconnect
        </Button>
      ) : !readonly ? (
        <Button variant="outline" onClick={onConnect} width="full" gap='standard.xs'>
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
          <Box textTransform="capitalize">Connect {provider === "twitter" ? `X (${provider})` : provider}</Box>
        </Button>
      ) : (
        <Box p={6} />
      )}
    </Flex>
  );
};
