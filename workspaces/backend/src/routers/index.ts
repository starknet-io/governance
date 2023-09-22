import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { router } from '../utils/trpc';
import { authRouter } from './auth';
import { commentsRouter } from './comments';
import { councilsRouter } from './councils';
import { delegateRouter } from './delegates';
import { pagesRouter } from './pages';
import { postsRouter } from './posts';
import { snipsRouter } from './snips';
import { usersRouter } from './users';
import { votesRouter } from './votes';
import { proposalsRouter } from './proposals';
import { fileUploadRouter } from './fileUpload';

export const appRouter = router({
  comments: commentsRouter,
  councils: councilsRouter,
  pages: pagesRouter,
  posts: postsRouter,
  snips: snipsRouter,
  users: usersRouter,
  votes: votesRouter,
  auth: authRouter,
  delegates: delegateRouter,
  proposals: proposalsRouter,
  fileUpload: fileUploadRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
