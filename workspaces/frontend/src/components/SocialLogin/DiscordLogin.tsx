import { trpc } from "../../utils/trpc";
import { DiscordLoginButton } from "react-social-login-buttons";
import { useState } from "react";

const DiscordAuth = ({ delegateId }: { delegateId: string }) => {
  const { data, isLoading, isError } =
    trpc.socials.initiateDiscordAuth.useQuery({
      delegateId,
    });
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching discord info...</div>;
  }

  console.log(data)

  if (data?.discordUsername) {
    return <div>Discord: ${data.discordUsername}</div>;
  }

  return <DiscordLoginButton onClick={handleDiscordLogin} />;
};

export default DiscordAuth;
