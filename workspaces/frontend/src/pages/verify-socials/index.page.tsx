import React, { useEffect, useState } from "react";
import { trpc } from "src/utils/trpc";
import { Flex, Spinner, Stack } from "@chakra-ui/react";
import { DocumentProps } from "../renderer/types";
import { navigate } from "vite-plugin-ssr/client/router";
import { usePageContext } from "src/renderer/PageContextProvider";
import { Button, Heading, Text } from "@yukilabs/governance-components";

export function Page() {
  const verifyDiscord = trpc.socials.verifyDiscord.useMutation();
  const verifyTwitter = trpc.socials.verifyTwitter.useMutation();
  const { user } = usePageContext();
  const userDelegate = trpc.users.isDelegate.useQuery({
    userId: user?.id || "",
  });
  const [error, setError] = useState(false);
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
            console.log(res);
            navigate(`/delegates/profile/${res.delegateId}`);
          },
          onError: () => {
            setError(true);
          },
        },
      );
    } else {
      navigate("/page-not-found");
    }
  }, []);

  return (
    <Flex
      height="100%"
      flex={1}
      alignItems={"center"}
      justifyContent={"center"}
      pb="50px"
    >
      {!error ? (
        <Spinner size="md" />
      ) : (
        <Stack dir="v" justifyContent="center" alignItems="center" gap={3}>
          <Heading variant="h3">
            Error Linking Social To Delegate Profile
          </Heading>
          {userDelegate && userDelegate?.data?.id && (
            <Button
              onClick={() =>
                navigate(`/delegates/profile/${userDelegate?.data?.id}`)
              }
            >
              Return to delegate profile
            </Button>
          )}
        </Stack>
      )}
    </Flex>
  );
}

export const documentProps = {
  title: "Verify Socials",
} satisfies DocumentProps;
