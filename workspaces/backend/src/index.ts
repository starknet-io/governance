import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

async function bootstrap() {
  app.use(cors())
  app.use("/trpc", createExpressMiddleware({ router: appRouter }));

  app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
  });

}

bootstrap();