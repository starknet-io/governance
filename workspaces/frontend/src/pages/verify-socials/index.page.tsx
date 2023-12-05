import React, { useEffect } from "react";
import { trpc } from "src/utils/trpc";
import { Spinner } from "@chakra-ui/react";
import { DocumentProps } from "../renderer/types";
import { navigate } from "vite-plugin-ssr/client/router";

export function Page() {
  const verifyDiscord = trpc.socials.verifyDiscord.useMutation();
  const verifyTwitter = trpc.socials.verifyTwitter.useMutation();
  const urlParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const code = urlParams ? urlParams.get("code") : "";
  const oauthToken = urlParams ? urlParams.get("oauth_token") : "";
  const oauthVerifier = urlParams ? urlParams.get("oauth_verifier") : "";
  console.log(oauthToken, oauthVerifier);
  const stateObject =
    urlParams && urlParams.get("state")
      ? JSON.parse(urlParams.get("state") || "")
      : "";

  useEffect(() => {
    if (code && code.length) {
      window.history.replaceState(null, "", window.location.pathname);
      if (stateObject.origin === "discord") {
        verifyDiscord.mutateAsync(
          {
            delegateId: stateObject.delegateId,
            code: code,
          },
          {
            onSuccess: () => {
              navigate(`/delegates/profile/${stateObject.delegateId}`);
            },
            onError: () => {
              navigate(`/delegates/profile/${stateObject.delegateId}`);
            },
          },
        );
      }
    } else if (oauthVerifier?.length && oauthToken?.length) {
      window.history.replaceState(null, "", window.location.pathname);
      verifyTwitter.mutateAsync(
        {
          oauthToken,
          oauthVerifier,
        },
        {
          onSuccess: (res) => {
            console.log(res)
            navigate(`/delegates/profile/${res.delegateId}`);
          },
          onError: () => {
            // navigate(`/delegates/profile/${stateObject.delegateId}`);
          },
        },
      );
    }
  }, [code, oauthVerifier, oauthToken]);

  return <Spinner />;
}

export const documentProps = {
  title: "VerifyDiscord",
} satisfies DocumentProps;
