import { SocialButton } from "./SocialButton";

const TwitterLogin = ({
  username,
  redirectUrl,
  isLoading,
  isError,
}: {
  username: string | null | undefined;
  redirectUrl?: string;
  isLoading?: boolean;
  isError?: any;
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
      onDisconnect={() => {
        alert("disconnect");
      }}
      onConnect={handleTwitterLogin}
      username={username}
      provider="twitter"
      isLoading={isLoading}
      isError={!!isError}
    />
  );
};

export default TwitterLogin;
