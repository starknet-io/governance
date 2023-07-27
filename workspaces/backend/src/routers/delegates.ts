import { z } from "zod";
import { db } from "../db/db";
import { delegates } from "../db/schema/delegates";
import { protectedProcedure, publicProcedure, router } from "../utils/trpc";
import { getUserByJWT } from "../utils/helpers";
import { eq } from "drizzle-orm";
import { users } from "../db/schema/users";
import { createInsertSchema } from "drizzle-zod";
import { comments } from "../db/schema/comments";

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
        starknetWalletAddress: z.string(),
        twitter: z.string(),
        discord: z.string(),
        discourse: z.string(),
        agreeTerms: z.boolean(),
        understandRole: z.boolean(),
      })
    )
    .mutation(async (opts) => {
      const userAddress = (await getUserByJWT(opts.ctx.req.cookies.JWT))?.address
      const user = await db.query.users.findFirst({
        where: eq(users.address, userAddress),
        with: {
          delegationStatement: true,
        }
      });
      if (user?.delegationStatement) {
        throw new Error("You already have a delegate statement");
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
    }
    ),

  getDelegateById: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
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
          author: true
        }
      })

    }),

  getDelegateComments: publicProcedure.
    input(z.object({ delegateId: z.string() }))
    .query(async (opts) => {
      return await db
        .select({
          ...comments._.columns,
          author: users._.columns,
        })
        .from(comments)
        .where(eq(comments.userId, users.id))
        .innerJoin(users, eq(delegates.userId, users.id))
        .innerJoin(delegates, eq(delegates.userId, opts.input.delegateId))
    }),

  editDelegate: protectedProcedure
    .input(delegateInsertSchema.required({ id: true }))
    .mutation(async (opts) => {
      const updatedDelegate = await db.update(delegates)
        .set(opts.input)
        .where(eq(delegates.id, opts.input.id))
        .returning();

      return updatedDelegate[0];
    }),

  getDelegateByAddress: publicProcedure
    .input(
      z.object({
        address: z.string()
      })
    )
    .query(async (opts) => {
      const user = await db.query.users.findFirst({
        where: eq(users.address, opts.input.address),
        with: {
          delegationStatement: true
        }
      })
      return user
    }),


});
