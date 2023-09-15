import { router, publicProcedure, protectedProcedure } from '../utils/trpc';
import { pages } from '../db/schema/pages';
import { db } from '../db/db';
import { asc, eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { getUserByJWT } from '../utils/helpers';
import slugify from 'slugify';
import { object, number, boolean } from 'zod';
import { buildLearnItemsHierarchy } from '../utils/buildLearnHierarchy';

const pageInsertSchema = createInsertSchema(pages);

// list(page, perPage, sortBy, filters)

export const pagesRouter = router({
  getAll: publicProcedure.query(
    async () =>
      await db.query.pages.findMany({
        with: {
          author: true,
        },
        orderBy: [asc(pages.orderNumber)],
      }),
  ),

  savePage: protectedProcedure
    .input(pageInsertSchema.omit({ id: true }))
    .mutation(async (opts) => {
      const insertedPage = await db
        .insert(pages)
        .values({
          ...opts.input,
          userId: (await getUserByJWT(opts.ctx.req.cookies.JWT))?.id,
          slug: slugify(opts.input.title ?? '', {
            replacement: '_',
            lower: true,
          }),
        })
        .returning();

      return insertedPage[0];
    }),

  editPage: protectedProcedure
    .input(pageInsertSchema.required({ id: true }))
    .mutation(async (opts) => {
      const updatedPage = await db
        .update(pages)
        .set({
          ...opts.input,
          slug: slugify(opts.input.title ?? '', {
            replacement: '_',
            lower: true,
          }),
        })
        .where(eq(pages.id, opts.input.id))
        .returning();
      return updatedPage[0];
    }),

  deletePage: protectedProcedure
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
          author: true,
        },
      });
      return page;
    }),

  getPagesTree: publicProcedure.query(async () => {
    const allPages = await db.query.pages.findMany();
    return buildLearnItemsHierarchy(allPages);
  }),

  savePagesTree: protectedProcedure
    .input(pageInsertSchema.omit({ createdAt: true, updatedAt: true }).array())
    .mutation(async (opts) => {
      const result = await Promise.all(
        opts.input.map(async (page) => {
          if (page.id) {
            return await db
              .update(pages)
              .set({
                ...page,
                userId: opts.ctx?.user.id,
                slug: slugify(page?.title ?? '', {
                  replacement: '_',
                  lower: true,
                }),
              })
              .where(eq(pages.id, page.id))
              .execute();
          }
        }),
      );

      return {
        items: opts.input,
        result,
      };
    }),

  saveBatch: protectedProcedure
    .input(pageInsertSchema.omit({ userId: true }).array())
    .mutation(async (opts) => {
      const userId = (await getUserByJWT(opts.ctx.req.cookies.JWT))?.id;
      await Promise.all(
        opts.input.map(async (page, index) => {
          if (page.id) {
            await db
              .update(pages)
              .set({
                ...page,
                orderNumber: index + 1,
                slug: slugify(page.title ?? '', {
                  replacement: '_',
                  lower: true,
                }),
              })
              .where(eq(pages.id, page.id))
              .execute();
          } else {
            await db
              .insert(pages)
              .values({
                title: page.title,
                content: page.content,
                orderNumber: index + 1,
                userId: userId,
                slug: slugify(page.title ?? '', {
                  replacement: '_',
                  lower: true,
                }),
              })
              .returning();
          }
        }),
      );
    }),
});
