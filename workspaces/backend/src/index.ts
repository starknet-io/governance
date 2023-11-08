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
import multer from 'multer';
import { delegateRouter } from "./routers/delegates";
import {notificationsRouter} from "./routers/notifications";

dotenv.config();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

const app: Express = express();
const port = process.env.PORT || 8000;

const fetchUserMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.cookies?.JWT) {
    const userId: string | undefined = (await getUserByJWT(req.cookies.JWT))?.id
    if (!userId) {
      return next();
    }
    const user = await db.query.users.findFirst({ where: eq(users.id, userId), with: { delegationStatement: true } });
    if (user) {
      req.user = user;
    }
  }
  next();
};

app.use(cookieParser());
app.use(fetchUserMiddleware);
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000', credentials: true }));

app.use("/trpc", upload.single('file'), createExpressMiddleware({
  router: appRouter,
  createContext
}));
app.use('/api/delegates', createExpressMiddleware({
  router: delegateRouter,
  createContext
}));
app.use('/api/notifications', createExpressMiddleware({
  router: notificationsRouter,
  createContext
}));

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});

export default app;
