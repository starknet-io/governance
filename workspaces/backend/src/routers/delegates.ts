import { z } from 'zod';
import { db } from '../db/db';
import { delegates } from '../db/schema/delegates';
import { protectedProcedure, publicProcedure, router } from '../utils/trpc';
import { getUserByJWT } from '../utils/helpers';
import { eq, and, isNotNull } from 'drizzle-orm';
import { users } from '../db/schema/users';
import { createInsertSchema } from 'drizzle-zod';
import { comments } from '../db/schema/comments';
import { customDelegateAgreement } from '../db/schema/customDelegateAgreement';

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
        understandRole: z.boolean(),
        customDelegateAgreementContent: z.optional(z.string()), // Optionally add custom agreement content
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

      // Validate that either customDelegateAgreementContent is provided or confirmDelegateAgreement is set
      if (
        !opts.input.customDelegateAgreementContent &&
        !opts.input.confirmDelegateAgreement
      ) {
        throw new Error(
          'Either customDelegateAgreementContent or confirmDelegateAgreement must be present',
        );
      }

      // Determine the agreement value
      const confirmDelegateAgreement = opts.input.customDelegateAgreementContent
        ? null // or some logic for custom agreement handling
        : opts.input.confirmDelegateAgreement;

      const insertedDelegate = await db
        .insert(delegates)
        .values({
          delegateStatement: opts.input.delegateStatement,
          delegateType: opts.input.delegateType,
          starknetWalletAddress: opts.input.starknetWalletAddress,
          twitter: opts.input.twitter,
          discord: opts.input.discord,
          discourse: opts.input.discourse,
          understandRole: opts.input.understandRole,
          userId: (await getUserByJWT(opts.ctx.req.cookies.JWT))?.id,
          createdAt: new Date(),
          confirmDelegateAgreement, // Use the determined value
        })
        .returning();

      const insertedDelegateRecord = insertedDelegate[0];

      // If customDelegateAgreementContent is provided, insert into customDelegateAgreement table
      if (opts.input.customDelegateAgreementContent) {
        await db.insert(customDelegateAgreement).values({
          delegateId: insertedDelegateRecord.id,
          content: opts.input.customDelegateAgreementContent,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      return insertedDelegateRecord;
    }),
  // For some reason, when there is both author: true and customAgreement: true, we get an error
  getDelegateById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async (opts) => {
      const delegateWithAuthor = await db.query.delegates.findFirst({
        where: eq(delegates.id, opts.input.id),
        with: {
          author: true,
        },
      });

      const delegateWithCustomAgreement = await db.query.delegates.findFirst({
        where: eq(delegates.id, opts.input.id),
        with: {
          customAgreement: true,
        },
      });

      if (!delegateWithAuthor || !delegateWithCustomAgreement) {
        throw new Error('Delegate not found');
      }

      // Merge the results
      const delegate = {
        ...delegateWithAuthor,
        customAgreement: delegateWithCustomAgreement.customAgreement,
      };

      return delegate;
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
});
