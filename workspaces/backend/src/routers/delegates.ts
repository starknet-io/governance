import { z } from 'zod';
import { delegates } from '../db/schema/delegates';
import { protectedProcedure, publicProcedure, router } from '../utils/trpc';
import { getUserByJWT } from '../utils/helpers';
import {eq, and, isNotNull, or, desc, asc} from 'drizzle-orm';
import { users } from '../db/schema/users';
import { createInsertSchema } from 'drizzle-zod';
import { comments } from '../db/schema/comments';
import { customDelegateAgreement } from '../db/schema/customDelegateAgreement';
import { snips } from '../db/schema/snips';
import { db } from '../db/db';
import { Algolia } from '../utils/algolia';
import { delegateVotes } from '../db/schema/delegatesVotes';

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
        statement: z.string(),
        interests: z.any(),
        twitter: z.string(),
        discord: z.string(),
        discourse: z.string(),
        understandRole: z.boolean(),
        starknetAddress: z.string(),
        customDelegateAgreementContent: z.optional(z.string()), // Optionally add custom agreement content
        confirmDelegateAgreement: z.optional(z.boolean()),
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

      // Determine the agreement value
      const confirmDelegateAgreement = opts.input.customDelegateAgreementContent
        ? null // or some logic for custom agreement handling
        : opts.input.confirmDelegateAgreement;

      const insertedDelegate = await db
        .insert(delegates)
        .values({
          statement: opts.input.statement,
          interests: opts.input.interests,
          twitter: opts.input.twitter,
          discord: opts.input.discord,
          discourse: opts.input.discourse,
          understandRole: opts.input.understandRole,
          userId: (await getUserByJWT(opts.ctx.req.cookies.JWT))?.id,
          createdAt: new Date(),
          confirmDelegateAgreement, // Use the determined value
        })
        .returning();

      await Algolia.saveObjectToIndex({
        name: opts.input.delegateStatement ?? '',
        type: 'delegate',
        refID: insertedDelegate[0].id,
      });

      const insertedDelegateRecord = insertedDelegate[0];
      if (insertedDelegate[0].userId) {
        await db
          .update(users)
          .set({
            starknetAddress: opts.input.starknetAddress,
          })
          .where(eq(users.id, insertedDelegate[0].userId));
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
    .input(
      delegateInsertSchema.required({ id: true }).extend({
        starknetAddress: z.string() || z.null(),
        id: z.string(),
        customDelegateAgreementContent: z.optional(z.string()),
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
          statement: opts.input.statement,
          interests: opts.input.interests,
          twitter: opts.input.twitter,
          discord: opts.input.discord,
          discourse: opts.input.discourse,
          understandRole: !!opts.input.understandRole,
          confirmDelegateAgreement: !!opts.input.confirmDelegateAgreement, // Use the determined value
        })
        .where(eq(delegates.id, opts.input.id))
        .returning();
      const updatedDelegateRecord = updatedDelegate[0];

      await Algolia.updateObjectFromIndex({
        name: updatedDelegateRecord.delegateStatement,
        type: 'delegate',
        refID: updatedDelegateRecord.id,
      });

      // Handle customDelegateAgreementContent if provided
      if (opts.input.customDelegateAgreementContent) {
        console.log('has custom agreement');
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
        await db
          .update(users)
          .set({
            starknetAddress: opts.input.starknetAddress,
          })
          .where(eq(users.id, updatedDelegate[0].userId));
      }

      return updatedDelegateRecord;
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

  getDelegatesWithSortingAndFilters: publicProcedure
    .input(
      z.object({
        searchQuery: z.string().optional(),
        filters: z.array(z.string()).optional(),
        sortBy: z.string().optional(),
      }),
    )
    .query(async (opts) => {
      // Determine if sorting is present - voting power, votes count, created at (default)
      const orderBy =
        opts.input.sortBy && opts.input.sortBy.length
          ? opts.input.sortBy === 'votingPower'
            ? desc(delegateVotes.votingPower)
            : desc(delegateVotes.totalVotes)
          : asc(delegateVotes.updatedAt);

      const specialFilters = [
        'delegate_agreement',
        'more_then_1m_voting_power',
        '1_or_more_votes',
        '1_or_more_comments',
      ];

      const appliedSpecialFilters =
        opts.input.filters?.filter((filter) =>
          specialFilters.includes(filter),
        ) || [];
      const appliedInterests =
        opts.input.filters?.filter(
          (filter) => !specialFilters.includes(filter),
        ) || [];

      try {
        const foundDelegates: any = await db
          .select()
          .from(delegates)
          .leftJoin(delegateVotes, eq(delegateVotes.delegateId, delegates.id))
          .leftJoin(users, eq(users.id, delegates.userId))
          .leftJoin(
            customDelegateAgreement,
            eq(customDelegateAgreement.delegateId, delegates.id),
          )
          .orderBy(orderBy);

        // Since we are using joins instead of with: [field]: true, we need to map to corresponding data format
        if (foundDelegates && foundDelegates.length) {

          let filteredDelegates = foundDelegates.map((foundDelegates: any) => ({
            ...foundDelegates.delegates,
            author: { ...foundDelegates.users },
            votingInfo: { ...foundDelegates.delegate_votes },
            delegateAgreement: !!(
              foundDelegates.custom_delegate_agreement ||
              foundDelegates.confirmDelegateAgreement
            ),
          }));

          // Apply filters now
          if (appliedSpecialFilters.includes('more_then_1m_voting_power')) {
            filteredDelegates = filteredDelegates.filter(
              (delegate: any) => delegate.votingInfo.votingPower > 1000000,
            );
          }

          if (appliedSpecialFilters.includes('1_or_more_votes')) {
            filteredDelegates = filteredDelegates.filter(
              (delegate: any) => delegate.votingInfo.totalVotes > 1,
            );
          }

          if (appliedSpecialFilters.includes('delegate_agreement')) {
            filteredDelegates = filteredDelegates.filter(
              (delegate: any) => delegate.delegateAgreement,
            );
          }

          if (appliedInterests.length) {
            filteredDelegates = filteredDelegates.filter((delegate: any) =>
              appliedInterests.some((interest) =>
                delegate.interests.includes(interest),
              ),
            );
          }

          return filteredDelegates;
        }
      } catch (error) {
        console.log(error);
        return [];
      }
    }),

  deleteDelegate: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const delegate = await db.query.delegates.findFirst({
        where: eq(delegates.id, opts.input.id),
      });

      if (!delegate) {
        throw new Error('Delegate not found');
      }

      await db
        .delete(customDelegateAgreement)
        .where(eq(customDelegateAgreement.delegateId, opts.input.id));
      await db.delete(delegates).where(eq(delegates.id, opts.input.id));
      await Algolia.deleteObjectFromIndex({
        type: 'delegate',
        refID: opts.input.id
      })
    }),
});
