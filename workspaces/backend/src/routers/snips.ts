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
    const data = await db.query.snips.findMany({
      with: {
        author: true,
        latestVersion: true,
      },
    });
    return data.map((snip) => ({
      ...snip,
      title: snip?.latestVersion?.title || snip.title,
      description: snip?.latestVersion?.description || snip.description,
      status: snip?.latestVersion?.status || snip.status,
    }));
  }),

  getSNIP: publicProcedure
    .input(snipInsertSchema.required({ id: true }).pick({ id: true }))
    .query(async (opts) => {
      const data = await db.query.snips.findFirst({
        where: eq(snips.id, opts.input.id),
        with: {
          author: true,
          latestVersion: true, // This will fetch the latest version details
          versions: {
            with: {
              comments: true, // This will fetch the comments for each version
            },
          },
        },
      });

      if (data && data.latestVersion) {
        // Overwriting snip's title and description with the latest version's ones
        data.title = data.latestVersion.title;
        data.description = data.latestVersion.description;
        data.status = data.latestVersion.status;
        data.discussionURL = data.latestVersion.discussionURL;
      }

      if (data && data.versions) {
        // Change versions from array to an object with version as key
        const versionsObj = data.versions.reduce((obj, version) => {
          obj[version.version] = version;
          return obj;
        }, {});
        data.versions = versionsObj;
      }

      return data;
    }),

  createSNIP: protectedProcedure
    .input(snipInsertSchema.omit({ id: true, type: true }))
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

      console.log(valuesToInsert);

      // Then, create a new snip version with snipId
      const insertedSnipVersion = await db
        .insert(snipVersions)
        .values(valuesToInsert)
        .returning();

      // Finally, update the newly created snip with latestVersionId
      await db
        .update(snips)
        .set({ latestVersionId: insertedSnipVersion[0].id })
        .where(eq(snips.id, newSnip[0].id)) // update only the correct snip
        .execute();

      return newSnip[0];
    }),

  editSNIP: publicProcedure
    .input(snipInsertSchema.required({ id: true }))
    .mutation(async (opts) => {
      // Fetching the existing snip first
      const snip = await db.query.snips.findFirst({
        where: eq(snips.id, opts.input.id),
      });

      if (!snip) {
        throw new Error('SNIP not found');
      }

      // Fetching the latest version for the fetched snip
      const latestSnipVersion = await db.query.snipVersions.findFirst({
        where: eq(snipVersions.id, snip.latestVersionId),
      });

      if (!latestSnipVersion) {
        throw new Error('Latest SNIP version not found');
      }

      const { id, ...values } = opts.input;

      const valuesToInsert = {
        ...values,
        snipId: id, // ensure that the snip id is passed correctly
        version: (+latestSnipVersion.version + 1).toString(), // Increment the version
        createdAt: new Date(), // Use the current time
      };

      // First, create a new snip version
      const insertedSnipVersion = await db
        .insert(snipVersions)
        .values(valuesToInsert)
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
