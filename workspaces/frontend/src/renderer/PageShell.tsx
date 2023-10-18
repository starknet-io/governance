import React, { useEffect } from "react";
import { PageContextProvider } from "./PageContextProvider";
import { ChakraProvider } from "@chakra-ui/react";
import type { PageContext } from "./types";
import { ApolloProvider, ApolloClient } from "@apollo/client";
import { trpc } from "src/utils/trpc";
import { theme } from "@yukilabs/governance-components";
import { MessagesProvider } from "./providers/MessagesProvider";
import { DynamicProvider } from "./providers/DynamicProvider";
import { layouts } from "src/pages/layouts";

interface Props {
  readonly pageContext: PageContext;
  readonly apolloClient: ApolloClient<any>;
  readonly children: React.ReactNode;
}

function useUserData() {
  const userQuery = trpc.auth.currentUser.useQuery();

  return userQuery;
}

export function PageShell(props: Props) {
  const { pageContext, children } = props;

  const userQuery = useUserData();
  const user = userQuery.data;

  useEffect(() => {
    const documentProps =
      pageContext.documentProps ?? pageContext.exports.documentProps;

    document.title = documentProps?.title ?? document.title;
  }, [
    pageContext.documentProps,
    pageContext.exports.documentProps,
    pageContext.pageProps,
  ]);

  type LayoutType = keyof typeof layouts;

  const urlToLayoutMap: Record<string, LayoutType> = {
    "/delegates/profile/onboarding/": "LayoutOnboarding",
  };

  const currentLayoutKey = Object.keys(urlToLayoutMap).find((prefix) =>
    pageContext.urlOriginal.startsWith(prefix),
  );
  const currentLayout: LayoutType =
    urlToLayoutMap[currentLayoutKey!] || "LayoutDefault";
  const LayoutComponent = layouts[currentLayout];

  if (!LayoutComponent) {
    return null;
  }
  return (
    // <React.StrictMode>
    <PageContextProvider pageContext={{ ...pageContext, user: user || null }}>
      <MessagesProvider>
        <ChakraProvider theme={theme}>
          <ApolloProvider client={props.apolloClient}>
            <DynamicProvider>
              <LayoutComponent pageContext={pageContext}>
                {children}
              </LayoutComponent>
            </DynamicProvider>
          </ApolloProvider>
        </ChakraProvider>
      </MessagesProvider>
    </PageContextProvider>
    // </React.StrictMode>
  );
}
