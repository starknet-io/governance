import { SocialButton } from "./SocialButton";

const TwitterLogin = ({
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
  const handleTwitterLogin = async () => {
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
      onDisconnect={onDisconnect}
      onConnect={handleTwitterLogin}
      username={username}
      provider="twitter"
      isLoading={isLoading}
      isError={!!isError}
    />
  );
};

export default TwitterLogin;
