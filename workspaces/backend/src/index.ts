import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers';
import { createContext } from './utils/createContex';
import cookieParser from 'cookie-parser';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use("/trpc", createExpressMiddleware({
  router: appRouter,
  createContext
}));


app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});


export default app;