import { z } from 'zod';
import { db } from '../db/db';
import { delegates } from '../db/schema/delegates';
import { protectedProcedure, publicProcedure, router } from '../utils/trpc';
import { getUserByJWT } from '../utils/helpers';
import {eq, and, isNotNull, or} from 'drizzle-orm';
import { users } from '../db/schema/users';
import { createInsertSchema } from 'drizzle-zod';
import { comments } from '../db/schema/comments';
import {snips} from "../db/schema/snips";

const delegateInsertSchema = createInsertSchema(delegates);

export const delegateRouter = router({
  getAll: publicProcedure.query(async () => await db.query.delegates.findMany({
    with: {
      author: true
    }
  })
  ),

  saveDelegate: protectedProcedure
    .input(
      z.object({
        delegateStatement: z.string(),
        delegateType: z.any(),
        twitter: z.string(),
        discord: z.string(),
        discourse: z.string(),
        agreeTerms: z.boolean(),
        understandRole: z.boolean(),
        starknetAddress: z.string(),
      })
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
      const insertedDelegate: any = await db
        .insert(delegates)
        .values({
          delegateStatement: opts.input.delegateStatement,
          delegateType: opts.input.delegateType,
          twitter: opts.input.twitter,
          discord: opts.input.discord,
          discourse: opts.input.discourse,
          agreeTerms: opts.input.agreeTerms,
          understandRole: opts.input.understandRole,
          userId: (await getUserByJWT(opts.ctx.req.cookies.JWT))?.id,
          createdAt: new Date(),
        })
        .returning();
      if (insertedDelegate[0].userId) {
        await db.update(users)
          .set({
            starknetAddress: opts.input.starknetAddress,
          })
          .where(eq(users.id, insertedDelegate[0].userId))
      }
      return insertedDelegate[0];
    }
    ),

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
        .select({
          ...comments,
          author: users,
          snipTitle: snips.title,
          proposalId: comments.proposalId,
        })
        .from(comments)
        .rightJoin(users, eq(users.id, comments.userId))
        .leftJoin(snips, eq(snips.id, comments.snipId)) // Join with snips to fetch the title
        .rightJoin(delegates, eq(delegates.userId, comments.userId))
        .where(
          and(
            or(isNotNull(comments.proposalId), isNotNull(comments.snipId)),
            eq(delegates.id, opts.input.delegateId),
          ),
        );
    }),

  editDelegate: protectedProcedure
    .input(delegateInsertSchema.required({ id: true }).extend({ starknetAddress: z.string() || z.null() }))
    .mutation(async (opts) => {
      const saveData = {
        delegateStatement: opts.input.delegateStatement,
        delegateType: opts.input.delegateType,
        twitter: opts.input.twitter,
        discord: opts.input.discord,
        discourse: opts.input.discourse,
        agreeTerms: opts.input.agreeTerms,
        understandRole: opts.input.understandRole,
        updatedAt: new Date(),
      }
      const updatedDelegate = await db.update(delegates)
        .set(saveData)
        .where(eq(delegates.id, opts.input.id))
        .returning();

      if (updatedDelegate[0].userId) {
        await db.update(users)
          .set({
            starknetAddress: opts.input.starknetAddress,
          })
          .where(eq(users.id, updatedDelegate[0].userId))
      }
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
          delegationStatement: true
        }
      })
      if (user) return user;
      return null;
    }),
});
