import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3030;

async function bootstrap() {

  app.use("/trpc", createExpressMiddleware({ router: appRouter }));

  app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
  });

}

bootstrap();