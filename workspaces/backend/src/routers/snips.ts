import { router, publicProcedure, protectedProcedure } from '../utils/trpc';
import { snips } from '../db/schema/snips';
import { db } from '../db/db';
import { desc, eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { getUserByJWT } from '../utils/helpers';
import { snipVersions } from '../db/schema/snipVersions';

const snipInsertSchema = createInsertSchema(snips);

// list(page, perPage, sortBy, filters)
// create voting proposal
// create snip proposal

export const snipsRouter = router({
  getAll: publicProcedure.query(async () => {
    return await db.query.snips.findMany({
      with: {
        author: true,
        latestVersion: true,
      },
    });
  }),

  getSNIP: publicProcedure
    .input(snipInsertSchema.required({ id: true }).pick({ id: true }))
    .query(async (opts) => {
      const data = await db.query.snips.findFirst({
        where: eq(snips.id, opts.input.id),
        with: {
          author: true,
          latestVersion: true, // This will fetch the latest version details
        },
      });

      if (data && data.latestVersion) {
        // Overwriting snip's title and description with the latest version's ones
        data.title = data.latestVersion.title;
        data.description = data.latestVersion.description;
      }
      console.log(data)
      return data;
    }),

  createSNIP: protectedProcedure
    .input(snipInsertSchema.omit({ id: true, type: true, status: true }))
    .mutation(async (opts) => {
      const userId = (await getUserByJWT(opts.ctx.req.cookies.JWT))?.id;
      if (!userId) {
        throw new Error('User not found');
      }

      // First, create a new snip without latestVersionId
      const newSnip = await db
        .insert(snips)
        .values({
          userId: userId,
          type: 'snip',
        })
        .returning();

      const valuesToInsert = {
        ...opts.input,
        snipId: newSnip[0].id, // linking new version to correct snip
        version: 1,
        createdAt: new Date(),
      };

      // Then, create a new snip version with snipId
      const insertedSnipVersion = await db
        .insert(snipVersions)
        .values(valuesToInsert)
        .returning();

      // Finally, update the newly created snip with latestVersionId
      const updatedSnip = await db
        .update(snips)
        .set({ latestVersionId: insertedSnipVersion[0].id })
        .where(eq(snips.id, newSnip[0].id)) // update only the correct snip
        .execute();

      return newSnip[0];
    }),

  editProposal: publicProcedure
    .input(snipInsertSchema.required({ id: true }))
    .mutation(async (opts) => {
      // First, create a new snip version
      const insertedSnipVersion = await db
        .insert(snipVersions)
        .values({
          ...opts.input,
          snipId: opts.input.id, // ensure that the snip id is passed correctly
          createdAt: new Date(), // Use the current time
        })
        .returning();

      // Then, update the snip's latest version with the id of the newly created snip version
      const updatedSnip = await db
        .update(snips)
        .set({
          latestVersionId: insertedSnipVersion[0].id,
        })
        .where(eq(snips.id, opts.input.id))
        .returning();

      return updatedSnip[0];
    }),

  deleteProposal: publicProcedure
    .input(snipInsertSchema.required({ id: true }).pick({ id: true }))
    .mutation(async (opts) => {
      await db.delete(snips).where(eq(snips.id, opts.input.id)).execute();
    }),
});
