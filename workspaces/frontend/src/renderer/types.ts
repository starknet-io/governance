import type {
  PageContextBuiltIn,
  //*
  // When using Client Routing https://vite-plugin-ssr.com/clientRouting
  PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient,
  /*/
  // When using Server Routing
  PageContextBuiltInClientWithServerRouting as PageContextBuiltInClient
  //*/
} from "vite-plugin-ssr/types";
import { ApolloClient } from '@apollo/client'

type Page = (pageProps: PageProps) => React.ReactElement;

export type PageProps = Record<string, unknown>;

export interface DocumentProps {
  title?: string;
  description?: string;
  image?: string;
}

export type PageContextCustom = {
  Page: Page;
  pageProps?: PageProps;
  hasLayout?: boolean;
  exports: {
    documentProps?: DocumentProps;
  };
  documentProps?: DocumentProps;
  locale: string;
  userAgent: string;
  redirectTo?: string;
  apolloClient?: ApolloClient<any>;
  apolloIntialState: any,
  routeParams: any
};

export type PageContextServer = PageContextBuiltIn<Page> & PageContextCustom;
export type PageContextClient = PageContextBuiltInClient<Page> &
  PageContextCustom;

export type PageContext = PageContextClient | PageContextServer;
