import {
  Divider,
  Flex,
  SummaryItems,
  Text,
} from "@yukilabs/governance-components";
import { useState } from "react";
import { usePageContext } from "../../renderer/PageContextProvider";
import { trpc } from "../../utils/trpc";
import DiscordLogin from "./DiscordLogin";
import { DiscourseFormModal } from "./DiscourseFormModal";
import { SocialButton } from "./SocialButton";
import TelegramLogin from "./TelegramLogin";
import TwitterLogin from "./TwitterLogin";

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
  const [showDiscourse, setShowDiscourse] = useState(false);

  const userDelegate = trpc.users.isDelegate.useQuery({
    userId: user?.id || "",
  });
  const socialsDelegate = trpc.socials.initiateSocialAuth.useQuery({
    id: user?.id as string,
    delegateId,
    origin: "discord",
  }, {
    enabled: user?.id != null,
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
      id: user!.id,
      origin,
    });
  };
  const closeDiscourseModal = () => {
    setShowDiscourse(false);
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
          {socials?.discourse && (
            <SummaryItems.Socials
              label="discourse"
              value={socials?.discourse}
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
          userId={user!.id}
          username={socialsDelegate?.data?.twitter?.username}
          isLoading={socialsDelegate?.isLoading}
          isError={socialsDelegate?.isError}
          onDisconnect={() => unlinkSocial("twitter")}
        />
        <TelegramLogin
          delegateId={delegateId}
          userId={user!.id}
          username={socialsDelegate?.data?.telegram?.username}
          onSuccess={socialsDelegate.refetch}
          onDisconnect={() => unlinkSocial("telegram")}
        />
        <SocialButton
          provider="discourse"
          username={socialsDelegate?.data?.discourse?.username}
          onConnect={() => setShowDiscourse(true)}
          onDisconnect={() => unlinkSocial("discourse")}
        />
        <DiscourseFormModal
          isOpen={showDiscourse}
          onClose={closeDiscourseModal}
          userId={user!.id}
          onSuccess={socialsDelegate.refetch}
          delagateId={delegateId}
        />
      </Flex>
      <Divider mt="standard.xl" mb="standard.xl" />
    </SummaryItems.Root>
  );
};

export default Socials;
