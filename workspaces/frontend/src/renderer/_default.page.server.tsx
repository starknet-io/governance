import { dangerouslySkipEscape, escapeInject } from "vite-plugin-ssr/server";
import { PageContextServer } from "./types";
import { PageShell } from "./PageShell";
import { getDefaultPageContext } from "./helpers";
import { getDataFromTree } from "@apollo/client/react/ssr";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import fetch from "cross-fetch";
import { TrpcProvider } from "./providers/TrpcProvider";

// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = [
  "hasLayout",
  "routeParams",
  "pageProps",
  "documentProps",
  "locale",
  "data",
  "apolloIntialState",
];

export async function onBeforeRender(pageContext: PageContextServer) {
  return {
    pageContext: await getDefaultPageContext(pageContext),
  };
}

function makeApolloClient() {
  const apolloClient = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: `${import.meta.env.VITE_APP_SNAPSHOT_URL}/graphql`,
      fetch,
    }),
    cache: new InMemoryCache(),
  });
  return apolloClient;
}

export async function render(pageContext: PageContextServer) {
  const { Page, pageProps, redirectTo } = pageContext;

  if (redirectTo) return {};

  const documentProps =
    pageContext.documentProps ?? pageContext.exports.documentProps;

  const apolloClient = makeApolloClient();

  // See https://www.apollographql.com/docs/react/performance/server-side-rendering/
  const page = (
    <TrpcProvider>
      <PageShell pageContext={pageContext} apolloClient={apolloClient}>
        <Page {...pageProps} />
      </PageShell>
    </TrpcProvider>
  );

  const pageHtml = await getDataFromTree(page);
  const apolloIntialState = apolloClient.extract();

  // Streaming is optional and we can use renderToString() instead
  // const stream = await renderToStream(page, {
  //   userAgent: pageContext.userAgent,
  // });

  const documentHtml = escapeInject`<!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />

      <!-- Favicons -->
      <link rel="icon" href="/favicon.ico" sizes="any">
      <link rel="icon" href="/icon.svg" type="image/svg+xml">
      <link rel="mask-icon" href="/icon.svg" color="black">
      <link rel="apple-touch-icon" href="/apple-touch-icon.png">
      <link rel="manifest" href="/manifest.webmanifest">

      <!-- Primary Meta Tags -->
      <title>${documentProps?.title ?? "Starknet"}</title>
      <meta name="title" content="${documentProps?.title ?? "Starknet"}">
      <meta name="description" content="${documentProps?.description ?? ""}">

      <!-- Open Graph / Facebook -->
      <meta property="og:type" content="website">
      <meta property="og:url" content="${pageContext.urlOriginal}">
      <meta property="og:title" content="${documentProps?.title ?? "Starknet"}">
      <meta property="og:description" content="${
        documentProps?.description ?? ""
      }">
      <meta property="og:image" content="${documentProps?.image ?? ""}">

      <!-- Twitter -->
      <meta property="twitter:card" content="summary_large_image">
      <meta property="twitter:url" content="${pageContext.urlOriginal}">
      <meta property="twitter:title" content="${
        documentProps?.title ?? "Starknet"
      }">
      <meta property="twitter:description" content="${
        documentProps?.description ?? ""
      }">
      <meta property="twitter:image" content="${documentProps?.image ?? ""}">

      <!-- Google tag (gtag.js) -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=${dangerouslySkipEscape(
        encodeURIComponent(import.meta.env.VITE_APP_GOOGLE_TAG_ID),
      )}"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', ${dangerouslySkipEscape(
          JSON.stringify(import.meta.env.VITE_APP_GOOGLE_TAG_ID),
        )});
      </script>
      <script>
        window.global = window;
      </script>
    </head>
    <body>
      <div id="page-view" style="overflow-x:hidden">${dangerouslySkipEscape(
        pageHtml,
      )}</div>
    </body>
  </html>`;

  return {
    documentHtml,
    pageContext: {
      apolloIntialState,
    },
  };
}
