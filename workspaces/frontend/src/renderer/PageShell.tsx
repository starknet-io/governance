import React, { useEffect } from "react";
import { PageContextProvider } from "./PageContextProvider";
import type { PageContext } from "./types";
import { TrpcProvider } from "./TrpcProvider";
import DynamicContextProviderPage from "./DynamicContexProviderPage";
import { ApolloProvider, ApolloClient } from "@apollo/client";

interface Props {
  readonly pageContext: PageContext;
  readonly apolloClient: ApolloClient<any>;
  readonly children: React.ReactNode;
}

export function PageShell(props: Props) {
  const { pageContext, children } = props;

  useEffect(() => {
    const documentProps =
      pageContext.documentProps ?? pageContext.exports.documentProps;

    document.title = documentProps?.title ?? document.title;
  }, [pageContext.pageProps]);

  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <ApolloProvider client={props.apolloClient}>
          <TrpcProvider>
            <DynamicContextProviderPage pageContext={pageContext}>
              {children}
            </DynamicContextProviderPage>
          </TrpcProvider>
        </ApolloProvider>
      </PageContextProvider>
    </React.StrictMode>
  );
}
