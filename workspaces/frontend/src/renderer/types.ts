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
import { ApolloClient } from "@apollo/client";
import { User } from "@yukilabs/governance-backend/src/db/schema/users";
import { Delegate } from "@yukilabs/governance-backend/src/db/schema/delegates";
import { layouts } from "src/pages/layouts";

type Page = (pageProps: PageProps) => React.ReactElement;

export type PageProps = Record<string, unknown>;

export interface DocumentProps {
  title?: string;
  description?: string;
  image?: string;
}

export interface IUser extends User {
  delegationStatement: Delegate;
}
type LayoutType = keyof typeof layouts;

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
  apolloIntialState: any;
  routeParams: any;
  user: IUser | null;
  layout?: LayoutType;
};

export type PageContextServer = PageContextBuiltIn<Page> & PageContextCustom;
export type PageContextClient = PageContextBuiltInClient<Page> &
  PageContextCustom;

export type PageContext = PageContextClient | PageContextServer;

export const ROLES = {
  ADMIN: "admin",
  MODERATOR: "moderator",
  USER: "user",
  SUPERADMIN: "superadmin",
  AUTHOR: "author",
};
