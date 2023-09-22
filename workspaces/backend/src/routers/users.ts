import { router, publicProcedure, protectedProcedure } from '../utils/trpc';
import { z } from 'zod';
import { users } from '../db/schema/users';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const usersRouter = router({
  getAll: protectedProcedure.query(() => db.query.users.findMany(
    {
      with: {
        delegationStatement: true,
      }
    }
  )),

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
    .mutation(async (opts) => {
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
    .mutation(async (opts) => {
      await db.delete(users).where(eq(users.id, opts.input.id)).execute();
    }),

  addRoles: protectedProcedure
    .input(
      z.object({
        address: z.string(),
        role: z.any()
      })
    )
    .mutation(async (opts) => {
      const user = await db.query.users.findFirst({
        where: eq(users.address, opts.input.address)
      });
      if (user) {
        const updatedUser = await db
          .update(users)
          .set({
            role: opts.input.role,
          })
          .where(eq(users.address, opts.input.address))
          .returning();
        return updatedUser[0];
      } else {
        const createdUser = await db
          .insert(users)
          .values({
            address: opts.input.address,
            role: opts.input.role,
            createdAt: new Date(),
          })
          .returning();
        return createdUser[0]
      }

    }),

  getUser: publicProcedure
    .input(
      z.object({
        address: z.string(),
      })
    )
    .query(async (opts) => {
      const user = await db.query.users.findFirst({
        where: eq(users.address, opts.input.address),
        with: {
          delegationStatement: true
        }
      });
      return user;
    }),

  editUserProfile: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        username: z.string().optional(),
        starknetAddress: z.string().optional(),
      })
    )
    .mutation(async (opts) => {
      await db
        .update(users)
        .set({
          username: opts.input.username,
          starknetAddress: opts.input.starknetAddress,
        })
        .where(eq(users.id, opts.input.id))
        .returning();
      return await db.query.users.findFirst({
        where: eq(users.id, opts.input.id),
        with: {
          delegationStatement: true
        }
      });
    }),

  me: protectedProcedure
    .query(async (opts) => {
      return opts.ctx.user
    }),

  editUserProfileByAddress: protectedProcedure
    .input(
      z.object({
        address: z.string(),
        username: z.string().optional(),
        starknetAddress: z.string().optional(),
      }))
    .mutation(async (opts) => {
      const user = await db.query.users.findFirst({
        where: eq(users.address, opts.input.address)
      })

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await db.update(users)
        .set({
          username: opts.input.username,
          starknetAddress: opts.input.starknetAddress,
          updatedAt: new Date(),
        })
        .where(eq(users.address, opts.input.address))

      return
    }),
});
