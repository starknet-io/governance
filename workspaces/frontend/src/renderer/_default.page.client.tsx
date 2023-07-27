import ReactDOM from "react-dom/client";
import { PageShell } from "./PageShell";
import type { PageContextClient } from "./types";
import { ApolloClient, InMemoryCache } from '@apollo/client'

export const clientRouting = true;
export const hydrationCanBeAborted = true;

let root: ReactDOM.Root;

export async function render(pageContext: PageContextClient) {
  const { Page, pageProps } = pageContext;
  const apolloClient = makeApolloClient(pageContext.apolloIntialState)

  const page = (
    <PageShell pageContext={pageContext} apolloClient={apolloClient}>
      <Page {...pageProps} />
    </PageShell>
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
function makeApolloClient(apolloIntialState: any) {
  return new ApolloClient({
    uri: `${import.meta.env.VITE_APP_SNAPSHOT_URL}/graphql`,
    cache: new InMemoryCache().restore(apolloIntialState)
  })
}
