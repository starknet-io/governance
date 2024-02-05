import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './createContex';
import superjson from 'superjson';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.req.cookies?.JWT) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }

  return next({
    ctx: {
      session: ctx.req.headers.cookie,
    },
  });
});

const isAdmin = t.middleware(({ next, ctx }) => {
  const userRole = ctx.user?.role; // Adjust according to your session structure

  if (userRole !== 'admin' && userRole !== 'superadmin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: "You don't have permission to perform this action",
    });
  }

  return next();
});

type EditUserInput = {
  id: string;
};

const hasPermission = t.middleware(({ next, ctx, rawInput }) => {
  const input = rawInput as EditUserInput;
  const userId = input?.id; // Adjust according to your input structure
  const sessionUserId = ctx?.user?.id; // Adjust according to your session structure
  const userRole = ctx?.user?.role;
  if (
    sessionUserId !== userId &&
    userRole !== 'admin' &&
    userRole !== 'superadmin'
  ) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: "You are not authorized to modify this user's data",
    });
  }

  return next();
});

const router = t.router;
const middleware = t.middleware;
const publicProcedure = t.procedure;
const protectedProcedure = t.procedure.use(isAuthed);

export { t, router, middleware, publicProcedure, protectedProcedure, isAdmin, hasPermission };
