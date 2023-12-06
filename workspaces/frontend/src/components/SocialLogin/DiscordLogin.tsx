import { trpc } from "../../utils/trpc";
import { SocialButton } from "./SocialButton";

const DiscordAuth = ({ delegateId }: { delegateId: string }) => {
  const { data, isLoading, isError } = trpc.socials.initiateSocialAuth.useQuery(
    {
      delegateId,
      origin: "discord",
    },
  );
  const handleDiscordLogin = async () => {
    try {
      if (data?.alreadyVerified) {
        console.log("asd");
      } else if (data?.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (error) {
      console.error("Failed to initiate Discord authentication:", error);
    }
  };

  const onDisconnect = () => {
    alert("Disconnecting Discord");
  };

  return (
    <SocialButton
      provider="discord"
      username={data?.discordUsername}
      onDisconnect={onDisconnect}
      onConnect={handleDiscordLogin}
      isError={isError}
      isLoading={isLoading}
    />
  );
};

export default DiscordAuth;
