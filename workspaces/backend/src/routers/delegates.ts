import { z } from 'zod';
import { db } from '../db/db';
import { delegateTypeEnum, delegates } from '../db/schema/delegates';
import { protectedProcedure, publicProcedure, router } from '../utils/trpc';
import { getUserByJWT } from '../utils/helpers';
import { and, eq, inArray } from 'drizzle-orm';
import { users } from '../db/schema/users';
import { createInsertSchema } from 'drizzle-zod';
import { asc, desc } from 'drizzle-orm';

const delegateInsertSchema = createInsertSchema(delegates);

export const delegateRouter = router({
  getAll: publicProcedure
    .input(
      z.object({
        orderBy: z.optional(
          z.array(
            z.object({
              column: z.enum(['createdAt']),
              sort: z.enum(['asc', 'desc']),
            }),
          ),
        ),
        search: z.optional(z.string()),
        filters: z.optional(
          z.object({
            delegateType: z.optional(
              z.array(delegateInsertSchema.shape.delegateType),
            ),
          }),
        ),
      }),
    )
    .query(
      async ({ ctx, input }) =>
        await db.query.delegates.findMany({
          with: {
            author: true,
          },
          orderBy: input.orderBy?.map(({ sort, column }) =>
            ({ asc, desc })[sort](delegates[column]),
          ),
          where:
            input.filters &&
            and(
              input.filters.delegateType &&
                inArray(delegates.delegateType, input.filters.delegateType),
            ),
        }),
    ),

  saveDelegate: protectedProcedure
    .input(
      z.object({
        delegateStatement: z.string(),
        delegateType: z.any(),
        starknetWalletAddress: z.string(),
        twitter: z.string(),
        discord: z.string(),
        discourse: z.string(),
        agreeTerms: z.boolean(),
        understandRole: z.boolean(),
      }),
    )
    .mutation(async (opts) => {
      const userAddress = (await getUserByJWT(opts.ctx.req.cookies.JWT))
        ?.address;
      const user = await db.query.users.findFirst({
        where: eq(users.address, userAddress),
        with: {
          delegationStatement: true,
        },
      });
      if (user?.delegationStatement) {
        throw new Error('You already have a delegate statement');
      }
      const insertedDelegate = await db
        .insert(delegates)
        .values({
          delegateStatement: opts.input.delegateStatement,
          delegateType: opts.input.delegateType,
          starknetWalletAddress: opts.input.starknetWalletAddress,
          twitter: opts.input.twitter,
          discord: opts.input.discord,
          discourse: opts.input.discourse,
          agreeTerms: opts.input.agreeTerms,
          understandRole: opts.input.understandRole,
          userId: (await getUserByJWT(opts.ctx.req.cookies.JWT))?.id,
          createdAt: new Date(),
        })
        .returning();
      return insertedDelegate[0];
    }),

  getDelegateById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async (opts) => {
      // return await db
      //   .select()
      //   .from(delegates)
      //   .where(eq(delegates.id, opts.input.id))
      //   .leftJoin(users, eq(delegates.userId, users.id))
      return await db.query.delegates.findFirst({
        where: eq(delegates.id, opts.input.id),
        with: {
          author: true,
        },
      });
    }),

  editDelegate: protectedProcedure
    .input(delegateInsertSchema.required({ id: true }))
    .mutation(async (opts) => {
      const updatedDelegate = await db
        .update(delegates)
        .set(opts.input)
        .where(eq(delegates.id, opts.input.id))
        .returning();

      return updatedDelegate[0];
    }),
});
