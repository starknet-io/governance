import { z } from 'zod';
import { db } from '../db/db';
import { delegates } from '../db/schema/delegates';
import { protectedProcedure, publicProcedure, router } from '../utils/trpc';
import { getUserByJWT } from '../utils/helpers';
import { eq, and, isNotNull } from 'drizzle-orm';
import { users } from '../db/schema/users';
import { comments } from '../db/schema/comments';
import { customDelegateAgreement } from '../db/schema/customDelegateAgreement';
import {createInsertSchema} from "drizzle-zod";

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
        twitter: z.string(),
        discord: z.string(),
        discourse: z.string(),
        understandRole: z.boolean(),
        starknetAddress: z.string(),
        customDelegateAgreementContent: z.optional(z.string()), // Optionally add custom agreement content
        confirmDelegateAgreement: z.optional(z.boolean()),
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
      console.log(user)
      if (user?.delegationStatement) {
        throw new Error('You already have a delegate statement');
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
      if (insertedDelegate[0].userId) {
        await db.update(users)
          .set({
            starknetAddress: opts.input.starknetAddress,
          })
          .where(eq(users.id, insertedDelegate[0].userId))
      }
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
        .select({...comments, author: users})
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
    .input(delegateInsertSchema.required({ id: true }).extend({ starknetAddress: z.string() || z.null() }))
    .input(
      z.object({
        id: z.string(),
        delegateStatement: z.string(),
        delegateType: z.any(),
        starknetWalletAddress: z.string(),
        twitter: z.string(),
        discord: z.string(),
        discourse: z.string(),
        understandRole: z.boolean(),
        customDelegateAgreementContent: z.optional(z.string()), // Optionally add or update custom agreement content
        confirmDelegateAgreement: z.optional(z.boolean()),
      }),
    )
    .mutation(async (opts) => {
      // Determine the agreement value
      const confirmDelegateAgreement = opts.input.customDelegateAgreementContent
        ? null
        : opts.input.confirmDelegateAgreement; // Use true or appropriate value for standard agreement

      const updatedDelegate = await db
        .update(delegates)
        .set({
          delegateStatement: opts.input.delegateStatement,
          delegateType: opts.input.delegateType,
          twitter: opts.input.twitter,
          discord: opts.input.discord,
          discourse: opts.input.discourse,
          understandRole: opts.input.understandRole,
          confirmDelegateAgreement, // Use the determined value
        })
        .where(eq(delegates.id, opts.input.id))
        .returning();

      const updatedDelegateRecord = updatedDelegate[0];

      // Handle customDelegateAgreementContent if provided
      if (opts.input.customDelegateAgreementContent) {
        const existingCustomAgreement =
          await db.query.customDelegateAgreement.findFirst({
            where: eq(
              customDelegateAgreement.delegateId,
              updatedDelegateRecord.id,
            ),
          });

        if (existingCustomAgreement) {
          // Update existing custom agreement
          await db
            .update(customDelegateAgreement)
            .set({
              content: opts.input.customDelegateAgreementContent,
              updatedAt: new Date(),
            })
            .where(eq(customDelegateAgreement.id, existingCustomAgreement.id));
        } else {
          // Insert new custom agreement
          await db.insert(customDelegateAgreement).values({
            delegateId: updatedDelegateRecord.id,
            content: opts.input.customDelegateAgreementContent,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } else if (confirmDelegateAgreement) {
        // If the standard agreement is selected, remove any existing custom agreement
        await db
          .delete(customDelegateAgreement)
          .where(
            eq(customDelegateAgreement.delegateId, updatedDelegateRecord.id),
          );
      }
      if (updatedDelegate[0].userId) {
        await db.update(users)
          .set({
            starknetAddress: opts.input.starknetAddress,
          })
          .where(eq(users.id, updatedDelegate[0].userId))
      }

      return updatedDelegateRecord;
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
      if (user) return user;
      return null;
    }),
});
