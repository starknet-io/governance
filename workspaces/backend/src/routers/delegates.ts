import { z } from "zod";
import { db } from "../db/db";
import { delegates } from "../db/schema/delegates";
import { protectedProcedure, publicProcedure, router } from "../utils/trpc";
import { getUserByJWT } from "../utils/helpers";
import { eq } from "drizzle-orm";
import { users } from "../db/schema/users";

//todo: join delegate and user
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
      return await db
        .select()
        .from(delegates)
        .where(eq(delegates.id, opts.input.id))
        .leftJoin(users, eq(delegates.userId, users.id))
    }
    ),

});
