import { DocumentProps } from "../../../renderer/types";
import { Flex, Spinner } from "@chakra-ui/react";
import { usePageContext } from "../../../renderer/PageContextProvider";
import {
  SuccessIcon,
  WarningIcon,
  Heading,
} from "@yukilabs/governance-components";
import { trpc } from "../../../utils/trpc";
import { useEffect, useState } from "react";

export function Page() {
  const pageContext = usePageContext();
  const confirmSubscription =
    trpc.subscriptions.confirmSubscription.useMutation();
  const [error, setError] = useState("");
  const [confirmedEmail, setConfirmedEmail] = useState(null);
  const isLoading = !error.length && !confirmedEmail;
  useEffect(() => {
    if (pageContext?.routeParams?.id && !error) {
      confirmSubscription.mutateAsync(
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
    }
  }, [pageContext?.routeParams?.id]);
  return (
    <Flex
      height="100%"
      flex={1}
      alignItems={"center"}
      justifyContent={"center"}
      pb="50px"
    >
      {isLoading && <Spinner boxSize="80px" />}
      {confirmedEmail && (
        <Flex
          gap={5}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <SuccessIcon boxSize="80px" />
          <Heading variant="h2">You've successfully subscribed at notifications at {confirmedEmail}</Heading>
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
    </Flex>
  );
}

export const documentProps = {
  title: "Subscription / Confirm",
} satisfies DocumentProps;
