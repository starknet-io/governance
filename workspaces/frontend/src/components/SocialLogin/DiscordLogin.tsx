import { SocialButton } from "./SocialButton";

const DiscordAuth = ({
  username,
  redirectUrl,
  isLoading,
  isError,
  onDisconnect,
}: {
  username: string | null | undefined;
  redirectUrl?: string;
  isLoading?: boolean;
  isError?: any;
  onDisconnect: () => void;
}) => {
  const handleDiscordLogin = async () => {
    try {
      if (redirectUrl && !username) {
        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error("Failed to initiate Discord authentication:", error);
    }
  };

  return (
    <SocialButton
      provider="discord"
      username={username}
      onDisconnect={onDisconnect}
      onConnect={handleDiscordLogin}
      isError={!!isError}
      isLoading={isLoading}
    />
  );
};

export default DiscordAuth;
