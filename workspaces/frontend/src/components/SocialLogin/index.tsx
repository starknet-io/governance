import {
  Box,
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
  const closeDiscourseModal = () => {
    setShowDiscourse(false);
  };
  if (
    (!isUserDelegate && !isUserDelegateCheckLoading) ||
    isUserDelegateCheckLoading
  ) {
    return (
      <Flex justify="flex-start" gap="4px">
        <Box width="50%">
          <Text variant="small" color="content.default.default">
            Socials
          </Text>
        </Box>
        <Box width="50%">
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
          </SummaryItems.Root>
        </Box>
      </Flex>
    );
  }

  return (
    <SummaryItems.Root direction={"column"}>
      <Flex direction="column" gap="standard.xs">
        <Text variant="small" color="content.default.default">Social networks</Text>
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
        <SocialButton
          provider="discourse"
          username={socialsDelegate?.data?.discourse?.username}
          onConnect={() => setShowDiscourse(true)}
          onDisconnect={() => unlinkSocial("discourse")}
        />
        <DiscourseFormModal
          isOpen={showDiscourse}
          onClose={closeDiscourseModal}
          onSuccess={socialsDelegate.refetch}
          delagateId={delegateId}
        />
      </Flex>
    </SummaryItems.Root>
  );
};

export default Socials;
