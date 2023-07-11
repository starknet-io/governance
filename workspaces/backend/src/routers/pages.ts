import { router, publicProcedure } from '../utils/trpc';
import { pages } from '../db/schema/pages';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

const pageInsertSchema = createInsertSchema(pages);

// list(page, perPage, sortBy, filters)

export const pagesRouter = router({
  getAll: publicProcedure.query(() => db.select().from(pages)),

  savePage: publicProcedure
    .input(pageInsertSchema.omit({ id: true }))
    .mutation(async (opts) => {
      const insertedPage = await db
        .insert(pages)
        .values(opts.input)
        .returning();

      return insertedPage[0];
    }),

  editPage: publicProcedure
    .input(pageInsertSchema.required({ id: true }))
    .mutation(async (opts) => {
      const updatedPage = await db
        .update(pages)
        .set(opts.input)
        .where(eq(pages.id, opts.input.id))
        .returning();
      return updatedPage[0];
    }),

  deletePage: publicProcedure
    .input(pageInsertSchema.required({ id: true }).pick({ id: true }))
    .mutation(async (opts) => {
      await db.delete(pages).where(eq(pages.id, opts.input.id)).execute();
    }),

  getPage: publicProcedure
    .input(pageInsertSchema.required({ id: true }).pick({ id: true }))
    .query(async (opts) => {
      const page = await db.query.pages.findFirst({
        where: eq(pages.id, opts.input.id),
        with: {
          author: true
        }
      });
      return page;
    }
    )
});
