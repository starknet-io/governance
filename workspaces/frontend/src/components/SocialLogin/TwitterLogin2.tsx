import { trpc } from "../../utils/trpc";
import { TwitterLoginButton } from "react-social-login-buttons";
import { useState } from "react";

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching twitter info...</div>;
  }

  console.log(data);

  if (data?.twitterUsername) {
    return <div>Twitter: {data.twitterUsername}</div>;
  }

  return <TwitterLoginButton onClick={handleTwitterLogin} />;
};

export default TwitterLogin;
