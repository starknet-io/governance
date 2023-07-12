import { router, publicProcedure } from '../utils/trpc';
import { pages } from '../db/schema/pages';
import { db } from '../db/db';
import { asc, eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { getUserByJWT } from '../utils/helpers';

const pageInsertSchema = createInsertSchema(pages);

// list(page, perPage, sortBy, filters)

export const pagesRouter = router({
  getAll: publicProcedure.query(async () => await db.query.pages.findMany({
    with: {
      author: true
    },
    orderBy: [asc(pages.orderNumber)]
  })),

  savePage: publicProcedure
    .input(pageInsertSchema.omit({ id: true }))
    .mutation(async (opts) => {
      const insertedPage = await db
        .insert(pages)
        .values({
          ...opts.input,
          userId: (await getUserByJWT(opts.ctx.req.cookies.JWT))?.id
        })
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
        },
      });
      return page;
    }),

  saveBatch: publicProcedure
    .input(pageInsertSchema.omit({ userId: true }).array())
    .mutation(async (opts) => {
      opts.input.map(async (page, index) => {
        if (page.id) {
          await db.update(pages)
            .set({
              orderNumber: index + 1
            })
            .where(eq(pages.id, page.id))
            .execute();
        } else {
          await db.insert(pages)
            .values({
              title: page.title,
              content: page.content,
              orderNumber: index + 1,
              userId: (await getUserByJWT(opts.ctx.req.cookies.JWT))?.id
            })
            .returning();
        }
      })
    })


});
