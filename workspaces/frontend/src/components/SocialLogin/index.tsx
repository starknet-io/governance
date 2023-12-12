import React from "react";
import DiscordLogin from "./DiscordLogin";
import TwitterLogin from "./TwitterLogin";
import TelegramLogin from "./TelegramLogin";
import {
  Divider,
  Flex,
  SummaryItems,
  Text,
} from "@yukilabs/governance-components";
import { usePageContext } from "../../renderer/PageContextProvider";
import { trpc } from "../../utils/trpc";
import { SocialButton } from "./SocialButton";

const Socials = ({
  delegateId,
  socials,
}: {
  delegateId: string;
  socials: {
    twitter?: string | null;
    discord?: string | null;
    telegram?: string | null;
    discourse?: string | null;
  };
}) => {
  const { user } = usePageContext();
  const userDelegate = trpc.users.isDelegate.useQuery({
    userId: user?.id || "",
  });
  const socialsDelegate = trpc.socials.initiateSocialAuth.useQuery({
    delegateId,
    origin: "discord",
  });
  const unlinkSocialDelegate = trpc.socials.unlinkDelegateSocial.useMutation({
    onSuccess: () => {
      socialsDelegate.refetch();
    },
  });
  const isUserDelegate = userDelegate?.data?.id === delegateId;
  const isUserDelegateCheckLoading = userDelegate?.isLoading;

  const unlinkSocial = (
    origin: "telegram" | "discord" | "twitter" | "discourse",
  ) => {
    unlinkSocialDelegate.mutateAsync({
      delegateId: delegateId,
      origin,
    });
  };

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
          <Divider mt="standard.xl" mb="standard.xl" />
        </SummaryItems.Root>
      </>
    );
  }

  return (
    <SummaryItems.Root direction={"column"}>
      <Flex direction="column" gap="standard.xs">
        <Text variant="bodySmallStrong">Social networks</Text>
        <DiscordLogin
          username={socialsDelegate?.data?.discord?.username}
          redirectUrl={socialsDelegate?.data?.discord?.redirectUrl}
          isLoading={socialsDelegate?.isLoading}
          isError={socialsDelegate?.isError}
          onDisconnect={() => unlinkSocial("discord")}
        />
        <TwitterLogin
          delegateId={delegateId}
          username={socialsDelegate?.data?.twitter?.username}
          isLoading={socialsDelegate?.isLoading}
          isError={socialsDelegate?.isError}
          onDisconnect={() => unlinkSocial("twitter")}
        />
        <TelegramLogin
          delegateId={delegateId}
          username={socialsDelegate?.data?.telegram?.username}
          onSuccess={socialsDelegate.refetch}
          onDisconnect={() => unlinkSocial("telegram")}
        />
        {socials?.discourse && (
          <SocialButton
            provider="discourse"
            readonly
            username={socials?.discourse}
          />
        )}
      </Flex>
      <Divider mt="standard.xl" mb="standard.xl" />
    </SummaryItems.Root>
  );
};

export default Socials;
