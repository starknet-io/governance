// We use a Express.js server for development
import express from "express";
import { renderPage } from "vite-plugin-ssr/server";
import { createServer } from "vite";
import fetch from "node-fetch";
import compression from "compression";
import { apiRouter } from "../api";
import  { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'

const app = express();

// We don't need gzip compression for dev. We use compression just to show
// that it's properly handled by vite-plugin-ssr and react-streaming.
app.use(compression());

const viteDevMiddleware = (
  await createServer({
    server: { middlewareMode: true },
  })
).middlewares;
app.use(viteDevMiddleware);

app.all(/\/api(.*)/, async (req, res, next) => {
  const httpResponse: Response = await apiRouter.handle(
    new Request(new URL(req.url, `http://localhost:${port}`), {
      method: req.method,
      body: req.body,
      headers: Object.entries(req.headers) as HeadersInit,
    })
  );

  if (httpResponse != null) {
    httpResponse.headers.forEach((value, key) => {
      res.header(key, value);
    });

    res.send(await httpResponse.text());
  } else {
    res.send("API!");
  }
});

app.get("*", async (req, res, next) => {
  try {
    const userAgent = req.headers["user-agent"]!;
    const apolloClient = makeApolloClient()
    const pageContextInit = {
      urlOriginal: req.originalUrl,
      fetch: fetch as WindowOrWorkerGlobalScope["fetch"],
      userAgent,
      apolloClient
    };

    const pageContext: any = await renderPage(pageContextInit);

    if (pageContext.redirectTo) {
      return res.redirect(pageContext.redirectTo);
    }

    const { httpResponse } = pageContext;
    if (!httpResponse) return next();
    res.type(httpResponse.contentType).status(httpResponse.statusCode);
    httpResponse.pipe(res);

  } catch (err) {
    console.log(err)
  }
});


function makeApolloClient() {
  const apolloClient = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: 'https://hub.snapshot.org/graphql',
      // fetch
    }),
    cache: new InMemoryCache()
  })
  return apolloClient
}

const port = 3000;
app.listen(port);
console.log(`Server running at http://localhost:${port}`);
