import React from "react";
import DiscordLogin from "./DiscordLogin";
import TwitterLogin2 from "./TwitterLogin2";
import TelegramLogin from "./TelegramLogin";
import {
  Divider,
  Flex,
  SummaryItems,
  Text,
} from "@yukilabs/governance-components";
import { usePageContext } from "../../renderer/PageContextProvider";
import { trpc } from "../../utils/trpc";

const Socials = ({
  delegateId,
  socials,
}: {
  delegateId: string;
  socials: {
    twitter?: string;
    discord?: string;
    telegram?: string;
    discourse?: string;
  };
}) => {
  const { user } = usePageContext();
  const userDelegate = trpc.users.isDelegate.useQuery({
    userId: user?.id || "",
  });
  const isUserDelegate = userDelegate?.data?.id === delegateId;
  const isUserDelegateCheckLoading = userDelegate?.isLoading;

  if (
    (!isUserDelegate && !isUserDelegateCheckLoading) ||
    isUserDelegateCheckLoading
  ) {
    return (
      <>
        <SummaryItems.Root direction="row">
          {socials?.twitter && (
            <SummaryItems.Socials
              label="twitter"
              value={socials?.twitter}
              isLoading={isUserDelegateCheckLoading}
            />
          )}
          {socials?.discourse && (
            <SummaryItems.Socials
              label="discourse"
              value={socials?.discourse}
              isLoading={isUserDelegateCheckLoading}
            />
          )}
          {socials?.discord && (
            <SummaryItems.Socials
              label="discord"
              value={socials?.discord}
              isLoading={isUserDelegateCheckLoading}
            />
          )}
          {socials?.telegram && (
            <SummaryItems.Socials
              label="telegram"
              value={socials?.telegram}
              isLoading={isUserDelegateCheckLoading}
            />
          )}
        </SummaryItems.Root>
        <Divider mt="standard.2xl" mb="standard.2xl" />
      </>
    );
  }

  return (
    <SummaryItems.Root direction={"column"}>
      <Flex direction="column" gap="standard.xs">
        <Text variant="bodySmallStrong">Social networks</Text>
        <DiscordLogin delegateId={delegateId} />
        <TwitterLogin2 delegateId={delegateId} />
        <TelegramLogin delegateId={delegateId} />
      </Flex>
      <Divider />
    </SummaryItems.Root>
  );
};

export default Socials;
