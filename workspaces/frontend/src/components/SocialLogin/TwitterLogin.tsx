import { SocialButton } from "./SocialButton";
import { trpc } from "../../utils/trpc";

const TwitterLogin = ({
  username,
  isLoading,
  isError,
  onDisconnect,
  delegateId,
  userId
}: {
  delegateId: string,
  username: string | null | undefined;
  redirectUrl?: string;
  isLoading?: boolean;
  isError?: any;
  onDisconnect: () => void;
  userId: string;
}) => {
  const redirectUrl = trpc.socials.getTwitterAuthUrl.useQuery({
    id: userId,
    delegateId,
  });
  const handleTwitterLogin = async () => {
    try {
      await redirectUrl.refetch()
      if (redirectUrl?.data && !username) {
        window.location.href = redirectUrl.data as string;
      }
    } catch (error) {
      console.error("Failed to initiate Discord authentication:", error);
    }
  };

  return (
    <SocialButton
      onDisconnect={onDisconnect}
      onConnect={handleTwitterLogin}
      username={username}
      provider="twitter"
      isLoading={isLoading || redirectUrl.isLoading}
      isError={!!isError}
    />
  );
};

export default TwitterLogin;
