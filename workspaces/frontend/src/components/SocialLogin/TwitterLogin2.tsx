import { trpc } from "../../utils/trpc";
import { SocialButton } from "./SocialButton";

const TwitterLogin = ({ delegateId }: { delegateId: string }) => {
  const { data, isLoading, isError } = trpc.socials.initiateSocialAuth.useQuery(
    {
      delegateId,
      origin: "twitter",
    },
  );
  const handleTwitterLogin = async () => {
    try {
      if (data?.alreadyVerified) {
      } else if (data?.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (error) {
      console.error("Failed to initiate Discord authentication:", error);
    }
  };

  return (
    <SocialButton
      onConnect={handleTwitterLogin}
      provider="twitter"
      isLoading={isLoading}
      isError={isError}
    />
  );
};

export default TwitterLogin;
