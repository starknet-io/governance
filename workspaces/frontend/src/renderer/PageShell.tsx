import React, { useEffect } from "react";
import { PageContextProvider } from "./PageContextProvider";
import type { PageContext } from "./types";
import { DynamicContextProviderPage } from "./DynamicContexProviderPage";
import { ApolloProvider, ApolloClient } from "@apollo/client";
import { ThemeProvider } from "@starknet-foundation/governance-ui";
import { trpc } from "src/utils/trpc";

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

  return (
    // <React.StrictMode>
    <PageContextProvider pageContext={{ ...pageContext, user: user || null }}>
      <ThemeProvider>
        <ApolloProvider client={props.apolloClient}>
          <DynamicContextProviderPage pageContext={pageContext}>
            {children}
          </DynamicContextProviderPage>
        </ApolloProvider>
      </ThemeProvider>
    </PageContextProvider>
    // </React.StrictMode>
  );
}
