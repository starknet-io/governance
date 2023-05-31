import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { users } from '../db/schema';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';
const crypto = require('crypto');

export const userRouter = router({
  getAll: publicProcedure.query(() => db.select().from(users)),

  saveUser: publicProcedure
    .input(
      z.object({
        address: z.string(),
        walletName: z.string(),
        walletProvider: z.string(),
        publicIdentifier: z.string(),
        dynamicId: z.string(),
      })
    )
    .mutation(async (opts) => {
      const insertedUser = await db
        .insert(users)
        .values({
          id: crypto.randomUUID(),
          address: opts.input.address,
          walletName: opts.input.walletName,
          walletProvider: opts.input.walletProvider,
          publicIdentifier: opts.input.publicIdentifier,
          dynamicId: opts.input.dynamicId,
          createdAt: new Date(),
        })
        .returning();
      return insertedUser[0];
    }),

  editUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
        address: z.string().optional(),
        walletName: z.string().optional(),
        walletProvider: z.string().optional(),
        publicIdentifier: z.string().optional(),
        dynamicId: z.string().optional(),
      })
    )
    .query(async (opts) => {
      const updatedUser = await db
        .update(users)
        .set({
          address: opts.input.address,
          walletName: opts.input.walletName,
          walletProvider: opts.input.walletProvider,
          publicIdentifier: opts.input.publicIdentifier,
          dynamicId: opts.input.dynamicId,
          updatedAt: new Date(),
        })
        .where(eq(users.id, opts.input.id))
        .returning();
      return updatedUser[0];
    }),

  deleteUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async (opts) => {
      await db.delete(users).where(eq(users.id, opts.input.id)).execute();
    }),
});
