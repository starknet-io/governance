import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./createContex";

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ next, ctx }) => {

  if (!ctx.req.cookies?.JWT) {
    throw new TRPCError({
      code: "UNAUTHORIZED"
    })
  }

  return next({
    ctx: {
      session: ctx.req.headers.cookie
    }
  });
});


const router = t.router;
const middleware = t.middleware;
const publicProcedure = t.procedure;
const protectedProcedure = t.procedure.use(isAuthed);

export {
  t,
  router,
  middleware,
  publicProcedure,
  protectedProcedure
}
