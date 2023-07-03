import { router, publicProcedure, protectedProcedure } from '../utils/trpc';
import { councils } from '../db/schema/councils';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import slugify from 'slugify';
import { users } from '../db/schema/users';
import { usersToCouncils } from '../db/schema/usersToCouncils';

const councilInsertSchema = createInsertSchema(councils).extend({
  addresses: z.array(z.string())
});

export const councilsRouter = router({
  getAll: publicProcedure.query(() => db.select().from(councils)),

  saveCouncil: protectedProcedure
    .input(councilInsertSchema.omit({ id: true }))
    .mutation(async (opts) => {
      const insertedCouncil = await db
        .insert(councils)
        .values({
          name: opts.input.name,
          description: opts.input.description,
          statement: opts.input.statement,
          slug: slugify(opts.input.name ?? '', { replacement: "_", lower: true },),
          enableComments: opts.input.enableComments,
          enableUpdate: opts.input.enableUpdate,
        })
        .returning();

      for (const address of opts.input.addresses) {
        const user = await db.insert(users).values({
          address: address
        }).returning();
        await db.insert(usersToCouncils).values({
          userId: user[0].id,
          councilId: insertedCouncil[0].id
        }).execute();
      }

      return insertedCouncil[0];
    }),

  editCouncil: protectedProcedure
    .input(councilInsertSchema.required({ id: true }))
    .mutation(async (opts) => {
      const updatedCouncil = await db
        .update(councils)
        .set(opts.input)
        .where(eq(councils.id, opts.input.id))
        .returning();
      return updatedCouncil[0];
    }),

  deleteCouncil: publicProcedure
    .input(councilInsertSchema.required({ id: true }).pick({ id: true }))
    .mutation(async (opts) => {
      await db.delete(councils).where(eq(councils.id, opts.input.id)).execute();
    }),

  getCouncilById: publicProcedure.
    input(z.object({ councilId: z.number() }))
    .query(async (opts) => {
      const data = await db.query.councils.findFirst({
        where: eq(councils.id, opts.input.councilId),
        with: {
          members: {
            with: {
              user: true
            }
          }
        }
      })
      return data;
    }),

  getCouncilBySlug: publicProcedure.
    input(z.object({ slug: z.string() }))
    .query(async (opts) => {
      return await db.query.councils.findFirst({
        where: eq(councils.slug, opts.input.slug),
        with: {
          members: {
            with: {
              user: true
            }
          }
        }
      })
    }),

});
