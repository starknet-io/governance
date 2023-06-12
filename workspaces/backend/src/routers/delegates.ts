import { z } from "zod";
import { db } from "../db/db";
import { delegateTypeEnum, delegates } from "../db/schema/delegates";
import { protectedProcedure, publicProcedure, router } from "../utils/trpc";
import { getUserByJWT } from "../utils/helpers";
import { eq } from "drizzle-orm";

const values = delegateTypeEnum.enumValues;

export const delegateRouter = router({
  getAll: publicProcedure.query(() => db.select().from(delegates)),

  saveDelegate: protectedProcedure
    .input(
      z.object({
        delegateStatement: z.string(),
        delegateType: z.enum(values),
        starknetWalletAddress: z.string(),
        twitter: z.string(),
        discord: z.string(),
        discourse: z.string(),
        agreeTerms: z.boolean(),
        understandRole: z.boolean(),
      })
    )
    .mutation(async (opts) => {
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
    }
    ),

});
