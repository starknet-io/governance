import React, { useEffect } from "react";
import { PageContextProvider } from "./PageContextProvider";
import type { PageContext } from "./types";
import { TrpcProvider } from "./TrpcProvider";
import DynamicContextProviderPage from "./DynamicContexProviderPage";
interface Props {
  readonly pageContext: PageContext;
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
        <TrpcProvider>
          <DynamicContextProviderPage pageContext={pageContext}>
            {children}
          </DynamicContextProviderPage>
        </TrpcProvider>
      </PageContextProvider>
    </React.StrictMode>
  );
}
