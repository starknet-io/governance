import { z } from 'zod';
import { delegates } from '../db/schema/delegates';
import { protectedProcedure, publicProcedure, router } from '../utils/trpc';
import { eq, and, isNotNull, or, desc, sql } from 'drizzle-orm';
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
        telegram: z.string(),
        discourse: z.string(),
        understandRole: z.boolean(),
        starknetAddress: z.string(),
        customDelegateAgreementContent: z.optional(z.string()), // Optionally add custom agreement content
        confirmDelegateAgreement: z.optional(z.boolean()),
      }),
    )
    .mutation(async (opts) => {
      const userAddress = opts.ctx.user?.address;
      const userId = opts.ctx.user?.id;
      if (!userAddress) {
        throw new Error('User not found');
      }

      // Check if a delegate with the user’s address already exists.
      const existingDelegate = await db.query.delegates.findFirst({
        where: eq(delegates.userId, userId),
      });

      if (existingDelegate) {
        throw new Error(
          'A delegate with the address of the user already exists',
        );
      }

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
          telegram: opts.input.telegram,
          discord: opts.input.discord,
          discourse: opts.input.discourse,
          understandRole: opts.input.understandRole,
          userId: opts.ctx.user?.id,
          createdAt: new Date(),
          confirmDelegateAgreement, // Use the determined value
        })
        .returning();

      await Algolia.saveObjectToIndex({
        name: (user?.ensName || user?.address) ?? '',
        type: 'delegate',
        address: user?.address,
        avatar: user?.profileImage || user?.ensAvatar || undefined,
        refID: insertedDelegate[0].id,
        content: opts.input.statement + ' ' + opts.input.interests,
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
      if (insertedDelegateRecord?.id) {
        await db.insert(delegateVotes).values({
          delegateId: insertedDelegateRecord.id,
          address: user?.address || '',
          votingPower: 0,
          totalVotes: 0,
          updatedAt: new Date(),
        });
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
      const userId = opts.ctx.user?.id;
      const userRole = opts.ctx.user?.role;
      if (!userId) throw new Error('User not found');

      // Ensure that the user is trying to edit their own delegate profile
      const delegate = await db.query.delegates.findFirst({
        where: eq(delegates.id, opts.input.id),
      });

      if (!delegate) throw new Error('Delegate not found');
      if (userRole !== 'admin' && userRole !== 'moderator') {
        if (delegate.userId !== userId) throw new Error('Unauthorizeds');
      }
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
          telegram: opts.input.telegram,
          discourse: opts.input.discourse,
          understandRole: !!opts.input.understandRole,
          isKarmaDelegate: false,
          isGovernanceDelegate: true,
          confirmDelegateAgreement: !!opts.input.confirmDelegateAgreement, // Use the determined value
        })
        .where(eq(delegates.id, opts.input.id))
        .returning();
      const updatedDelegateRecord = updatedDelegate[0];

      if (updatedDelegate[0].userId) {
        const user = await db.query.users.findFirst({
          where: eq(users.id, updatedDelegate[0].userId),
        });

        if (user) {
          await Algolia.updateObjectFromIndex({
            refID: updatedDelegate[0].id,
            type: 'delegate',
            address: user.address,
            name: user.ensName || user.address,
            content: opts.input.statement + ' ' + opts.input?.interests,
          });
        } else {
          console.error(
            'User not found for delegate with ID:',
            updatedDelegate[0].id,
          );
        }
      }

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
          : desc(delegateVotes.votingPower); // Default to sort by voting power

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

          // Filter out the delegates based on the comment count
          if (appliedSpecialFilters.includes('1_or_more_comments')) {
            // Fetch the count of comments for each delegate
            const commentCounts: any = await db
              .select({
                delegateId: delegates.id,
                count: sql<number>`count(${comments.id})`,
              })
              .from(delegates)
              .leftJoin(comments, eq(comments.userId, delegates.userId))
              .groupBy(delegates.id);

            // Convert this to a dictionary/map for easier lookup
            const commentCountMap = commentCounts.reduce(
              (acc: { [key: string]: number }, cur: any) => {
                acc[cur.delegateId] = cur.count;
                return acc;
              },
              {},
            );
            filteredDelegates = filteredDelegates.filter(
              (delegate: any) => commentCountMap[delegate.id] >= 1,
            );
          }

          if (appliedInterests.length) {
            filteredDelegates = filteredDelegates.filter((delegate: any) =>
              appliedInterests.every((interest) =>
                delegate.interests.includes(interest),
              ),
            );
          }

          const shuffleArray = (array: any[]) => {
            for (let i = array.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
          };

          if (
            !opts.input.sortBy &&
            !opts.input.sortBy?.length &&
            !opts.input.filters?.length
          ) {
            const quarterLength = Math.floor(filteredDelegates.length / 4);
            const firstQuarter = shuffleArray(
              filteredDelegates.slice(0, quarterLength),
            );
            const remaining = shuffleArray(
              filteredDelegates.slice(quarterLength),
            );

            filteredDelegates = firstQuarter.concat(remaining);
          }

          return filteredDelegates;
        }
      } catch (error) {
        console.log(error);
        return [];
      }
    }),

  deleteDelegate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      const userId = opts.ctx.user?.id;
      const userRole = opts.ctx.user?.role;
      if (!userId) throw new Error('User not found');

      const delegate = await db.query.delegates.findFirst({
        where: eq(delegates.id, opts.input.id),
      });

      if (!delegate) throw new Error('Delegate not found');

      if (userRole !== 'admin' && userRole !== 'moderator') {
        if (delegate.userId !== userId) throw new Error('Unauthorized');
      }

      await db
        .delete(customDelegateAgreement)
        .where(eq(customDelegateAgreement.delegateId, opts.input.id));
      await db.delete(delegates).where(eq(delegates.id, opts.input.id));
      await Algolia.deleteObjectFromIndex({
        type: 'delegate',
        refID: opts.input.id,
      });
    }),
});
