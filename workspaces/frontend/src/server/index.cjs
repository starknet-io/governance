const express = require('express')
const { renderPage } = require('vite-plugin-ssr/server')

const isProduction = process.env.NODE_ENV === 'production'
const root = `${__dirname}/../..`

startServer()

async function startServer() {
  const app = express()

  if (isProduction) {
    app.use(express.static(`${root}/dist/client`))
  } else {
    const vite = require('vite')
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true }
      })
    ).middlewares
    app.use(viteDevMiddleware)
  }

  app.use(express.text()) // Parse & make HTTP request body available at `req.body`

  app.get('*', async (req, res, next) => {
    const pageContextInit = {
      urlOriginal: req.originalUrl
    }
    const pageContext = await renderPage(pageContextInit)

    if (pageContext.redirectTo) {
      return res.redirect(pageContext.redirectTo);
    }

    const { httpResponse } = pageContext
    if (!httpResponse) return next()
    const { statusCode, contentType } = httpResponse
    res.status(statusCode).type(contentType)
    httpResponse.pipe(res)
  })

  const port = process.env.PORT || 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}
