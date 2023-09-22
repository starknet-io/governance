import { router, publicProcedure, protectedProcedure } from '../utils/trpc';
import { councils } from '../db/schema/councils';
import { db } from '../db/db';
import { and, desc, eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import slugify from 'slugify';
import { users } from '../db/schema/users';
import { usersToCouncils } from '../db/schema/usersToCouncils';
import { Algolia } from '../utils/algolia';

const councilInsertSchema = createInsertSchema(councils).extend({
  members: z.array(
    z.object({
      address: z.string(),
      name: z.string().optional().nullable(),
      twitterHandle: z.string().optional().nullable(),
      miniBio: z.string().optional().nullable(),
    }),
  ),
});

type MemberType = {
  address: string;
  name?: string | null | undefined;
  twitterHandle?: string | null | undefined;
  miniBio?: string | null | undefined;
};

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
          slug: slugify(opts.input.name ?? '', {
            replacement: '_',
            lower: true,
          }),
          address: opts.input.address,
        })
        .returning();

      await Algolia.saveObjectToIndex({
        name: insertedCouncil[0].name || "",
        type: 'council',
        refID: insertedCouncil[0].slug || insertedCouncil[0].id,
        content:
          insertedCouncil[0].description + ' ' + insertedCouncil[0].statement,
      });

      for (const member of opts.input.members) {
        const user = await db.query.users.findFirst({
          where: eq(users.address, member.address),
        });
        if (!user) {
          const newUser = await db
            .insert(users)
            .values({
              address: member.address,
              name: member.name,
              twitter: member.twitterHandle,
              miniBio: member.miniBio,
            })
            .returning();
          await db
            .insert(usersToCouncils)
            .values({
              userId: newUser[0].id,
              councilId: insertedCouncil[0].id,
            })
            .execute();
        } else {
          await db
            .update(users)
            .set({
              name: member.name,
              twitter: member.twitterHandle,
              miniBio: member.miniBio,
            })
            .where(eq(users.id, user.id))
            .execute();
          await db
            .insert(usersToCouncils)
            .values({
              userId: user.id,
              councilId: insertedCouncil[0].id,
            })
            .execute();
        }
      }

      return insertedCouncil[0];
    }),

  editCouncil: protectedProcedure
    .input(councilInsertSchema.required({ id: true }))
    .mutation(async (opts) => {
      // Extract duplicate code into helper functions.
      const insertUser = async (member: MemberType) => {
        return await db
          .insert(users)
          .values({
            address: member.address,
            name: member.name,
            twitter: member.twitterHandle,
            miniBio: member.miniBio,
          })
          .returning();
      };

      const insertUserToCouncil = async (userId: string, councilId: number) => {
        return await db
          .insert(usersToCouncils)
          .values({
            userId: userId,
            councilId: councilId,
          })
          .execute();
      };

      const updateUser = async (userId: string, member: MemberType) => {
        return await db
          .update(users)
          .set({
            name: member.name,
            twitter: member.twitterHandle,
            miniBio: member.miniBio,
          })
          .where(eq(users.id, userId))
          .execute();
      };
      const slug = slugify(opts.input.name ?? '', {
        replacement: '_',
        lower: true,
      })
      // Update council.
      const updatedCouncil = await db
        .update(councils)
        .set({
          name: opts.input.name,
          description: opts.input.description,
          statement: opts.input.statement,
          slug: slug,
          address: opts.input.address,
        })
        .where(eq(councils.id, opts.input.id))
        .returning();

      await Algolia.updateObjectFromIndex({
        name: opts.input.name ?? '',
        type: 'council',
        refID: slug || opts.input.id,
        content: opts.input.description + " " + opts.input.statement,
      });

      // Process members.
      for (const member of opts.input.members) {
        const user = await db.query.users.findFirst({
          where: eq(users.address, member.address),
        });

        if (!user) {
          // User doesn't exist, create a new user.
          const newUser = await insertUser(member);
          await insertUserToCouncil(newUser[0].id, opts.input.id);
          continue; // Skip to next member.
        }

        // User exists, check if they're connected to the council.
        const userToCouncil = await db.query.usersToCouncils.findFirst({
          where: and(
            eq(usersToCouncils.userId, user.id),
            eq(usersToCouncils.councilId, opts.input.id),
          ),
        });

        if (!userToCouncil) {
          // User isn't connected to the council, connect them.
          await insertUserToCouncil(user.id, opts.input.id);
        } else {
          // User is already connected to the council, update the user's info.
          await updateUser(user.id, member);
        }
      }

      return updatedCouncil[0];
    }),

  deleteCouncil: publicProcedure
    .input(councilInsertSchema.required({ id: true }).pick({ id: true }))
    .mutation(async (opts) => {
      await db.delete(councils).where(eq(councils.id, opts.input.id)).execute();
      await Algolia.deleteObjectFromIndex({
        refID: opts.input.id,
        type: 'council',
      });
    }),

  getCouncilById: publicProcedure
    .input(z.object({ councilId: z.number() }))
    .query(async (opts) => {
      const data = await db.query.councils.findFirst({
        where: eq(councils.id, opts.input.councilId),
        with: {
          members: {
            with: {
              user: true,
            },
          },
        },
      });
      return data;
    }),

  getCouncilBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async (opts) => {
      return await db.query.councils.findFirst({
        where: eq(councils.slug, opts.input.slug),
        with: {
          posts: {
            with: {
              comments: true,
            },
            orderBy: [desc(councils.createdAt)],
          },
          members: {
            with: {
              user: true,
            },
          },
        },
      });
    }),

  deleteUserFromCouncil: protectedProcedure
    .input(z.object({ userAddress: z.string(), councilId: z.number() }))
    .mutation(async (opts) => {
      const user = await db.query.users.findFirst({
        where: eq(users.address, opts.input.userAddress),
      });
      if (!user) return;
      await db
        .delete(usersToCouncils)
        .where(
          and(
            eq(usersToCouncils.userId, user.id),
            eq(usersToCouncils.councilId, opts.input.councilId),
          ),
        )
        .execute();
    }),

  getCouncilSlug: publicProcedure
    .input(z.object({ councilId: z.number() }))
    .query(async (opts) => {
      const data = await db.query.councils.findFirst({
        where: eq(councils.id, opts.input.councilId),
      });
      return data?.slug;
    }),
});
