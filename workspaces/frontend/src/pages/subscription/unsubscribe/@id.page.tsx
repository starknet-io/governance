import { DocumentProps } from "../../../renderer/types";
import { Flex, Spinner } from "@chakra-ui/react";
import { usePageContext } from "../../../renderer/PageContextProvider";
import {
  SuccessIcon,
  WarningIcon,
  Heading,
  Button,
} from "@yukilabs/governance-components";
import { trpc } from "../../../utils/trpc";
import { useState } from "react";

export function Page() {
  const pageContext = usePageContext();
  const unsubscribe = trpc.subscriptions.confirmUnsubscription.useMutation();
  const [error, setError] = useState("");
  const {
    data: email,
    isLoading: isLoadingEmail,
    isError: isFetchEmailError,
  } = trpc.subscriptions.getSubscriberEmailAddress.useQuery({
    confirmationToken: pageContext.routeParams!.id as string,
  });
  const [confirmedEmail, setConfirmedEmail] = useState(null);
  const [confirmUnsubscribe, setConfirmUnsubscribe] = useState(false);
  const isLoading = !error.length && !confirmedEmail;
  const handleUnsubscribe = () => {
    setConfirmUnsubscribe(true);
    unsubscribe.mutateAsync(
      {
        confirmationToken: pageContext.routeParams!.id,
      },
      {
        onSuccess: (res) => {
          setConfirmedEmail(res);
        },
        onError: (err) => {
          setError(err?.message || "An error occurred");
        },
      },
    );
  };
  return (
    <Flex
      height="100%"
      flex={1}
      alignItems={"center"}
      justifyContent={"center"}
      pb="50px"
    >
      {!confirmUnsubscribe ? (
        <Flex
          gap={5}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          {isLoadingEmail ? (
            <Spinner boxSize="80px" />
          ) : (
            <>
              {isFetchEmailError || (!isLoadingEmail && email === null) ? (
                <Heading variant="h2">
                  Error Fetching Subscriber Information
                </Heading>
              ) : (
                <>
                  <Heading variant="h2">
                    Are you sure you want to unsubscribe notifications at{" "}
                    <span color="content.danger.default">{email}</span>
                  </Heading>
                  <Button variant="primary" onClick={handleUnsubscribe}>
                    Unsubscribe
                  </Button>
                </>
              )}
            </>
          )}
        </Flex>
      ) : (
        <>
          {isLoading && <Spinner boxSize="80px" />}
          {confirmedEmail && (
            <Flex
              gap={5}
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <SuccessIcon boxSize="80px" />
              <Heading variant="h2">
                You've successfully unsubscribed at notifications at{" "}
                <span color="content.success.default">{confirmedEmail}</span>
              </Heading>
            </Flex>
          )}
          {error && error.length && (
            <Flex
              gap={5}
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <WarningIcon boxSize="80px" />
              <Heading variant="h2">Error: {error}</Heading>
            </Flex>
          )}
        </>
      )}
    </Flex>
  );
}

export const documentProps = {
  title: "Subscription / Unsubscribe",
} satisfies DocumentProps;
