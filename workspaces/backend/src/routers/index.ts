import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./users";

export const appRouter = router({
  users: userRouter,
  auth: authRouter
});

export type AppRouter = typeof appRouter;