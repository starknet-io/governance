import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers';
import { createContext } from './utils/createContex';
import cookieParser from 'cookie-parser';
import { db } from './db/db';
import { users } from './db/schema/users';
import { eq } from 'drizzle-orm';
import { getUserByJWT } from './utils/helpers';
import { delegateVoting } from "./routers/delegateVoting";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});

const fetchUserMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.cookies?.JWT) {
    const userId: string = (await getUserByJWT(req.cookies.JWT))?.id
    const user = await db.query.users.findFirst({ where: eq(users.id, userId), with: { delegationStatement: true } });
    if (user) {
      req.user = user;
    }
  }
  next();
};


app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(fetchUserMiddleware);
app.use("/trpc", createExpressMiddleware({
  router: appRouter,
  createContext
}));

delegateVoting();

export default app;
