import React, { useEffect } from "react";
import { trpc } from "src/utils/trpc";
import { Spinner } from "@chakra-ui/react";
import { DocumentProps } from "../renderer/types";
import { navigate } from "vite-plugin-ssr/client/router";

export function Page() {
  const verifyDiscord = trpc.socials.verifyDiscord.useMutation();
  const urlParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const code = urlParams ? urlParams.get("code") : "";
  const stateObject =
    urlParams && urlParams.get("state")
      ? JSON.parse(urlParams.get("state") || "")
      : "";
  console.log(code, stateObject);

  useEffect(() => {
    if (code && code.length) {
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
          },
        );
      }
    }
  }, [code]);

  return <Spinner />;
}

export const documentProps = {
  title: "VerifyDiscord",
} satisfies DocumentProps;
