import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { router } from '../utils/trpc';
import { authRouter } from './auth';
import { commentsRouter } from './comments';
import { councilsRouter } from './councils';
import { delegateRouter } from './delegates';
import { pagesRouter } from './pages';
import { postsRouter } from './posts';
import { proposalsRouter } from './proposals';
import { usersRouter } from './users';
import { votesRouter } from './votes';

export const appRouter = router({
  commemts: commentsRouter,
  councils: councilsRouter,
  pages: pagesRouter,
  posts: postsRouter,
  proposals: proposalsRouter,
  users: usersRouter,
  votes: votesRouter,
  auth: authRouter,
  delegates: delegateRouter
});

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
