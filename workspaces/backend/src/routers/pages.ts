import { router, publicProcedure, protectedProcedure } from '../utils/trpc';
import { pages } from '../db/schema/pages';
import { db } from '../db/db';
import { asc, eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import slugify from 'slugify';
import { boolean } from 'zod';
import { buildLearnItemsHierarchy } from '../utils/buildLearnHierarchy';

const pageInsertSchema = createInsertSchema(pages);

// list(page, perPage, sortBy, filters)

function checkUserRole(userRole: string | undefined) {
  if (!userRole) throw new Error('User not found');
  if (userRole !== 'admin' && userRole !== 'moderator')
    throw new Error('Unauthorized');
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
      checkUserRole(opts.ctx.user?.role); // Apply role check

      const insertedPage = await db
        .insert(pages)
        .values({
          ...opts.input,
          userId: opts.ctx.user?.id,
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
      checkUserRole(opts.ctx.user?.role); // Apply role check

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
      checkUserRole(opts.ctx.user?.role); // Apply role check

      await db.delete(pages).where(eq(pages.parentId, opts.input.id)).execute();
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
    const allPages = await db.query.pages.findMany({
      with: {
        author: true,
      },
    });
    return buildLearnItemsHierarchy(allPages);
  }),

  savePagesTree: protectedProcedure
    .input(
      pageInsertSchema
        .extend({ isNew: boolean().optional() })
        .omit({ createdAt: true, updatedAt: true, userId: true })
        .array(),
    )
    .mutation(async (opts) => {
      checkUserRole(opts.ctx.user?.role); // Apply role check

      const newItems = opts.input.filter((item) => item.isNew);
      const existingItems = opts.input.filter((item) => !item.isNew);
      const newCreatedItems = await Promise.all(
        newItems.map(async (newItem) => {
          const createdItem = await db
            .insert(pages)
            .values({
              title: newItem.title,
              content: newItem.content,
              orderNumber: newItem.orderNumber,
              userId: opts.ctx?.user.id,
              slug: slugify(newItem.title ?? '', {
                replacement: '_',
                lower: true,
              }),
            })
            .returning();
          return {
            createdItem: createdItem[0],
            oldId: newItem.id,
          };
        }),
      );

      const finalItems = existingItems.map((existingItem) => {
        const isLinkedToNew = newCreatedItems.find(
          (item) => item.oldId === existingItem.parentId,
        );

        if (isLinkedToNew) {
          return {
            ...existingItem,
            parentId: isLinkedToNew.createdItem.parentId,
          };
        }

        return existingItem;
      });

      const mapThrough = [
        ...finalItems,
        ...newCreatedItems.map((i) => i.createdItem),
      ];

      await Promise.all(
        mapThrough.map(async (m) => {
          return await db
            .update(pages)
            .set({
              title: m.title,
              content: m.content,
              parentId: m.parentId,
              orderNumber: m.orderNumber,
              slug: slugify(m?.title ?? '', {
                replacement: '_',
                lower: true,
              }),
            })
            .where(eq(pages.id, m.id!));
        }),
      );

      return;
    }),

  saveBatch: protectedProcedure
    .input(pageInsertSchema.omit({ userId: true }).array())
    .mutation(async (opts) => {
      checkUserRole(opts.ctx.user?.role); // Apply role check

      const userId = opts.ctx.user?.id;
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
