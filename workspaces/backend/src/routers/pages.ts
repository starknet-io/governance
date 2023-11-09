import { router, publicProcedure, protectedProcedure } from '../utils/trpc';
import { pages } from '../db/schema/pages';
import { db } from '../db/db';
import { asc, eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import slugify from 'slugify';
import {boolean, z} from 'zod';
import { buildLearnItemsHierarchy } from '../utils/buildLearnHierarchy';
import { Algolia } from '../utils/algolia';

const pageInsertSchema = createInsertSchema(pages);

// list(page, perPage, sortBy, filters)

function checkUserRole(userRole: string | undefined) {
  if (!userRole) throw new Error('User not found');
  if (userRole !== 'superadmin' && userRole !== 'admin' && userRole !== 'moderator')
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

  editPage: protectedProcedure
    .input(pageInsertSchema.required({ id: true }))
    .mutation(async (opts: any) => {
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

      const page = updatedPage[0];

      await Algolia.updateObjectFromIndex({
        name: page.title ?? '',
        type: 'learn',
        refID: page.id,
        content: page.content || '',
      });

      return page;
    }),

  deletePage: protectedProcedure
    .input(pageInsertSchema.required({ id: true }).extend({ id: z.number() }).pick({ id: true }))
    .mutation(async (opts) => {
      checkUserRole(opts.ctx.user?.role); // Apply role check

      const children = await db.query.pages.findMany({
        where: eq(pages.parentId, opts.input.id),
      });
      await Promise.all(
        children.map((childPage) => {
          return Algolia.deleteObjectFromIndex({
            type: 'learn',
            refID: childPage.id,
          });
        }),
      );
      await db.delete(pages).where(eq(pages.parentId, opts.input.id)).execute();
      await db.delete(pages).where(eq(pages.id, opts.input.id)).execute();
      await Algolia.deleteObjectFromIndex({
        type: 'learn',
        refID: opts.input.id,
      });
    }),

  getPage: publicProcedure
    .input(pageInsertSchema.required({ id: true }).extend({ id: z.number() }).pick({ id: true }))
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
        newItems.map(async (newItem: any) => {
          const createdItem = await db
            .insert(pages)
            .values({
              title: newItem.title,
              content: newItem.content,
              orderNumber: newItem.orderNumber,
              parentId: newItem.parentId,
              userId: opts.ctx?.user.id,
              slug: slugify(newItem.title ?? '', {
                replacement: '_',
                lower: true,
              }),
            })
            .returning();

          const newlyCreatedItem = createdItem[0];
          await Algolia.saveObjectToIndex({
            name: newlyCreatedItem.title ?? '',
            type: 'learn',
            refID: newlyCreatedItem.id,
            content: newlyCreatedItem.content ?? '',
          });
          return {
            createdItem: newlyCreatedItem,
            oldId: newItem.id,
          };
        }),
      );

      const allItems = [
        ...existingItems,
        ...newCreatedItems.map((item) => item.createdItem),
      ];

      const updatedItems = allItems.map((existingItem) => {
        const isLinkedToNew = newCreatedItems.find(
          (item) => item.oldId === existingItem.parentId,
        );

        if (isLinkedToNew) {
          return {
            ...existingItem,
            parentId: isLinkedToNew.createdItem.id,
          };
        }

        return existingItem;
      });

      await Promise.all(
        updatedItems.map(async (m: any) => {
          const updatedItem = await db
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
            .where(eq(pages.id, m.id!))
            .returning();
          await Algolia.updateObjectFromIndex({
            name: updatedItem?.[0]?.title ?? '',
            type: 'learn',
            refID: updatedItem?.[0]?.id,
            content: updatedItem?.[0]?.content || '',
          });
          return updatedItem;
        }),
      );

      return;
    }),
});
