import { router, publicProcedure, protectedProcedure } from '../utils/trpc';
import { pages } from '../db/schema/pages';
import { db } from '../db/db';
import { asc, eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { getUserByJWT } from '../utils/helpers';
import slugify from 'slugify';
import { object, array, string, number } from 'zod';

const pageInsertSchema = createInsertSchema(pages);

// list(page, perPage, sortBy, filters)

async function getAllPagesData(data: any[]) {
  const resultPages: any[] = [];

  async function getNestedData(page: any) {
    const subPages: any[] = [];

    if (Array.isArray(page.children) && page.children.length > 0) {
      for (const subPage of page.children) {
        if (subPage.id) {
          const subPageData = await db.query.pages.findFirst({
            where: eq(pages.id, subPage.id),
          });

          subPages.push({
            ...subPageData,
            children: await getAllPagesData(subPage.children),
          });
        }
      }
    }

    if (page?.page) {
      return { ...page?.page, children: subPages };
    }

    const pageData = await db.query.pages.findFirst({
      where: eq(pages.id, page.id),
    });

    return {
      ...pageData,
      children: subPages,
    };
  }

  for (const page of data) {
    const r = await getNestedData(page);
    r && resultPages.push(r);
  }

  return resultPages;
}

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
    const pagesTree = await db.query.pagesTree.findMany({
      with: {
        page: {
          with: {
            author: true,
          },
        },
      },
    });
    return await getAllPagesData(pagesTree);
  }),

  savePagesTree: protectedProcedure
    .input(
      pageInsertSchema
        .omit({ userId: true, createdAt: true, updatedAt: true, author: true })
        .extend({
          subPages: object({
            id: number(),
            orderNumber: number(),
            subPages: object({ id: number(), orderNumber: number() }).array(),
          }).array(),
        })
        .array(),
    )
    .mutation(async (opts) => {
      const result = await Promise.all(
        opts.input.map(async (page, index) => {
          return await db
            .insert(pages)
            .values({
              title: page.title,
              content: page.content,
              orderNumber: index + 1,
              userId: opts.ctx?.user.id,
              slug: slugify(page?.title + Date.now() ?? '', {
                replacement: '_',
                lower: true,
              }),
            })
            .returning();
        }),
      );

      return {
        user: opts.ctx.user,
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
