import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { users } from '../db/schema';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';

export const userRouter = router({
  getAll: publicProcedure.query(() => db.select().from(users)),

  saveUser: publicProcedure
    .input(
      z.object({
        fullName: z.string(),
        lastName: z.string(),
      })
    )
    .query(async (opts) => {
      const insertedUser = await db
        .insert(users)
        .values({
          fullName: opts.input.fullName,
          lastName: opts.input.lastName,
        })
        .returning();
      return insertedUser[0];
    }),

  editUser: publicProcedure
    .input(
      z.object({
        id: z.number(),
        fullName: z.string(),
        lastName: z.string(),
      })
    )
    .query(async (opts) => {
      const updatedUser = await db
        .update(users)
        .set({
          fullName: opts.input.fullName,
          lastName: opts.input.lastName,
        })
        .where(eq(users.id, opts.input.id))
        .returning();
      return updatedUser[0];
    }),

  deleteUser: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async (opts) => {
      await db.delete(users).where(eq(users.id, opts.input.id)).execute();
    }),
});
