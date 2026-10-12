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
import { delegateRouter } from './routers/delegates';
import { notificationsRouter } from './routers/notifications';
import helmet from 'helmet';
import morgan from 'morgan';

dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app: Express = express();
const port = process.env.PORT || 8000;

const fetchUserMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (req.cookies?.JWT) {
    const userId: string | undefined = (await getUserByJWT(req.cookies.JWT))
      ?.id;
    if (!userId) {
      return next();
    }
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: { delegationStatement: true },
    });
    if (user) {
      req.user = user;
    }
  }
  next();
};

app.use(helmet());
app.use(cookieParser());
app.use(fetchUserMiddleware);

morgan.token('decoded-url', (req: any) => decodeURIComponent(req.originalUrl));
app.use(
  morgan(':method :decoded-url :status :response-time ms\n', {
    skip: function (req: any, res: any) {
      return res.statusCode < 400;
    },
  }),
);

// SECURITY (F-02): Normalized origin allowlist for credentialed browser requests.
const allowedOrigins: string[] = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((origin: string) => origin.trim().replace(/\/+$/, '').toLowerCase())
  .filter((origin: string) => origin.length > 0);

/**
 * Resolves request origin against the explicit allowlist.
 * Never falls back to client-spoofable headers like X-Forwarded-For.
 */
const isOriginAllowed = (req: any): boolean => {
  const rawOrigin = req.headers.origin;
  if (!rawOrigin) return false;

  const origin: string = String(rawOrigin).replace(/\/+$/, '').toLowerCase();
  if (allowedOrigins.length === 0) {
    // Fail-closed default: if no allowlist is configured, cross-origin requests are rejected.
    return false;
  }
  return allowedOrigins.includes(origin);
};

/**
 * Rejects state-changing requests whose Origin is not allowlisted to prevent CSRF.
 */
const checkOriginMiddleware = (req: any, res: any, next: any) => {
  const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];
  if (SAFE_METHODS.includes(req.method)) {
    next();
    return;
  }

  if (!isOriginAllowed(req)) {
    res.status(403).send('Access Denied');
    return;
  }
  next();
};

app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) {
        // Same-origin or non-browser caller (curl, server-to-server).
        callback(null, false);
        return;
      }
      const normalized: string = origin.replace(/\/+$/, '').toLowerCase();
      callback(null, allowedOrigins.includes(normalized));
    },
    credentials: true,
  }),
);

app.use(checkOriginMiddleware);

app.get('/health', (req, res) => res.sendStatus(200));

app.use(
  '/trpc',
  upload.single('file'),
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);
app.use(
  '/api/delegates',
  createExpressMiddleware({
    router: delegateRouter,
    createContext,
  }),
);
app.use(
  '/api/notifications',
  createExpressMiddleware({
    router: notificationsRouter,
    createContext,
  }),
);

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});

export default app;
