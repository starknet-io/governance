import { z } from 'zod';
import { db } from '../db/db';
import { delegates } from '../db/schema/delegates';
import { protectedProcedure, publicProcedure, router } from '../utils/trpc';
import { getUserByJWT } from '../utils/helpers';
import { eq, and, isNotNull, sql } from 'drizzle-orm';
import { users } from '../db/schema/users';
import { createInsertSchema } from 'drizzle-zod';
import { comments } from '../db/schema/comments';

const delegateInsertSchema = createInsertSchema(delegates);

export const delegateRouter = router({
  getAll: publicProcedure.query(
    async () =>
      await db.query.delegates.findMany({
        with: {
          author: true,
        },
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

  getDelegateComments: publicProcedure
    .input(z.object({ delegateId: z.string() }))
    .query(async (opts) => {
      return await db
        // @ts-expect-error TODO fix types issue here
        .select({ ...comments, author: users })
        .from(comments)
        .rightJoin(users, eq(users.id, comments.userId))
        .rightJoin(delegates, eq(delegates.userId, comments.userId))
        .where(
          and(
            isNotNull(comments.proposalId),
            eq(delegates.id, opts.input.delegateId),
          ),
        );
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

  getDelegateByAddress: publicProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .query(async (opts) => {
      const user = await db.query.users.findFirst({
        where: eq(users.address, opts.input.address),
        with: {
          delegationStatement: true,
        },
      });
      return user;
    }),

  getDelegateByFiltersAndSort: publicProcedure
    .input(
      z.object({
        searchQuery: z.string().optional(),
        filters: z.array(z.string()).optional(),
      }),
    )
    .query(async (opts) => {
      try {
        //If no filters / search is applied
        if (!opts.input?.filters?.length && !opts.input?.searchQuery) {
          return await db.query.delegates.findMany({
            with: {
              author: true,
            },
          });
        }

        const filters = opts.input.filters!.map((i) => `'${i}'`).join(',');
        const sqlQuery = `
          EXISTS (
            SELECT 1
            FROM json_array_elements_text(type) AS elem
            WHERE elem IN (${filters})
          )
        `;

        const result = await db.query.delegates.findMany({
          with: { author: true },
          //With or without search based on filters
          where: opts.input.filters?.length ? sql.raw(sqlQuery) : undefined,
        });

        const address = opts.input?.searchQuery;
        if (opts.input?.searchQuery) {
          //Simple solution for now till we replace it with query call
          return result.filter((i) => i.author?.address === address);
        }

        return result;
      } catch (error) {
        console.log(error);
        return [];
      }
    }),
});
