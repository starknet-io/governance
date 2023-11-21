import ReactDOM from "react-dom/client";
import { PageShell } from "./PageShell";
import type { PageContextClient } from "./types";
import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { TrpcProvider } from "./providers/TrpcProvider";
import fetch from "cross-fetch";

export const clientRouting = true;
export const hydrationCanBeAborted = true;

let root: ReactDOM.Root;

export async function render(pageContext: PageContextClient) {
  const { Page, pageProps } = pageContext;
  const apolloClient = makeApolloClient(pageContext.apolloIntialState);

  const page = (
    <TrpcProvider>
      <PageShell pageContext={pageContext} apolloClient={apolloClient}>
        <Page {...pageProps} />
      </PageShell>
    </TrpcProvider>
  );
  const container = document.getElementById("page-view")!;

  if (pageContext.isHydration) {
    root = ReactDOM.hydrateRoot(container, page);
  } else {
    if (!root) {
      root = ReactDOM.createRoot(container);
    }
    root.render(page);
  }
}

export function onHydrationEnd() {
  console.log("Hydration finished; page is now interactive.");
}
export function onPageTransitionStart() {
  console.log("Page transition start");
  document.querySelector("body")!.classList.add("page-is-transitioning");
}
export function onPageTransitionEnd() {
  console.log("Page transition end");
  document.querySelector("body")!.classList.remove("page-is-transitioning");
}
const snapshotLink = createHttpLink({
  uri: `${import.meta.env.VITE_APP_SNAPSHOT_URL}/graphql`,
  fetch,
});

const snapshotXLink = createHttpLink({
  uri: `${import.meta.env.VITE_APP_SNAPSHOTX_URL}/graphql`,
  fetch,
});

function makeApolloClient() {
  const apolloClient = new ApolloClient({
    ssrMode: true,
    link: ApolloLink.split(
      (operation) => operation.getContext().clientName === "snapshotX",
      snapshotXLink,
      snapshotLink,
    ),
    cache: new InMemoryCache(),
  });
  return apolloClient;
}
