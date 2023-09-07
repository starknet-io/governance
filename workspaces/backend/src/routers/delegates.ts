import { z } from 'zod';
import { delegates } from '../db/schema/delegates';
import { protectedProcedure, publicProcedure, router } from '../utils/trpc';
import { getUserByJWT } from '../utils/helpers';
import { eq, and, isNotNull, sql, or } from 'drizzle-orm';
import { users } from '../db/schema/users';
import { createInsertSchema } from 'drizzle-zod';
import { comments } from '../db/schema/comments';
import { customDelegateAgreement } from '../db/schema/customDelegateAgreement';
import { snips } from '../db/schema/snips';
import { db } from '../db/db';

const delegateInsertSchema = createInsertSchema(delegates);

export const delegateRouter = router({
  getAll: publicProcedure.query(
    async () =>
      await db.query.delegates.findMany({
        with: {
          delegateVotes: true,
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

  getDelegateByFiltersAndSort: publicProcedure
    .input(
      z.object({
        searchQuery: z.string().optional(),
        filters: z.array(z.string()).optional(),
        sortBy: z.string().optional(),
      }),
    )
    .query(async (opts) => {
      console.log(opts.input)
      const orderByClause = opts.input.sortBy
        ? (entities, { desc }) => {
          console.log(entities)
          return [desc(entities.delegateVotes[opts.input.sortBy])]
        }
        : undefined;
      console.log(orderByClause)
      try {
        //If no filters / search is applied
        if (!opts.input?.filters?.length && !opts.input?.searchQuery) {
          return await db.query.delegates.findMany({
            with: {
              author: true,
              delegateVotes: {
                columns: {
                  totalVotes: true,
                  votingPower: true,
                },
              },
            },
            orderBy: orderByClause,
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
          with: { author: true, delegateVotes: true },
          //With or without search based on filters
          where: opts.input.filters?.length ? sql.raw(sqlQuery) : undefined,
          orderBy: orderByClause,
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
    }),
});
