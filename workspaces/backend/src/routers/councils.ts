import {router, publicProcedure, protectedProcedure, isAdmin} from '../utils/trpc';
import { councils } from '../db/schema/councils';
import { db } from '../db/db';
import { and, desc, eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import slugify from 'slugify';
import { Algolia } from '../utils/algolia';
import {members} from "../db/schema/members";

const councilInsertSchema = createInsertSchema(councils).extend({
  members: z.array(
    z.object({
      id: z.number().optional(),
      address: z.string(),
      name: z.string().optional().nullable(),
      twitterHandle: z.string().optional().nullable(),
      miniBio: z.string().optional().nullable(),
    }),
  ),
});

type MemberType = {
  id?: number | null
  address: string;
  name?: string | null | undefined;
  twitterHandle?: string | null | undefined;
  miniBio?: string | null | undefined;
};

function checkUserRole(userRole: string | undefined) {
  if (!userRole) throw new Error('User not found');
  if (
    userRole !== 'superadmin' &&
    userRole !== 'admin' &&
    userRole !== 'moderator'
  )
    throw new Error('Unauthorized');
}

export const councilsRouter = router({
  getAll: publicProcedure.query(() => db.select().from(councils)),

  saveCouncil: protectedProcedure
    .input(councilInsertSchema.omit({ id: true }))
    .mutation(async (opts) => {
      // Check User Role
      checkUserRole(opts.ctx.user?.role);

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
        name: insertedCouncil[0].name || '',
        type: 'council',
        refID: insertedCouncil[0].slug || insertedCouncil[0].id,
        content:
          insertedCouncil[0].description + ' ' + insertedCouncil[0].statement,
      });

      for (const member of opts.input.members) {
          await db
            .insert(members)
            .values({
              address: member.address,
              name: member.name,
              twitter: member.twitterHandle,
              miniBio: member.miniBio,
              councilId: insertedCouncil[0].id
            })
            .returning();
      }

      return insertedCouncil[0];
    }),

  editCouncil: protectedProcedure
    .input(councilInsertSchema.required({ id: true }))
    .mutation(async (opts) => {
      const userRole = opts.ctx.user?.role;
      checkUserRole(userRole);

      const insertMember = async (member: MemberType) => {
        await db
          .insert(members)
          .values({
            address: member.address,
            name: member.name,
            twitter: member.twitterHandle,
            miniBio: member.miniBio,
            councilId: opts.input.id
          })
          .returning();
      }

      const updateMember = async (memberId: number, member: MemberType) => {
        return await db
          .update(members)
          .set({
            address: member.address,
            name: member.name,
            twitter: member.twitterHandle,
            miniBio: member.miniBio,
          })
          .where(eq(members.id, memberId))
          .execute();
      };
      const slug = slugify(opts.input.name ?? '', {
        replacement: '_',
        lower: true,
      });
      // Update council.
      const updatedCouncil = await db
        .update(councils)
        .set({
          name: opts.input.name,
          description: opts.input.description,
          statement: opts.input.statement,
          slug: slugify(opts.input.name ?? '', {
            replacement: '_',
            lower: true,
          }),
          address: opts.input.address,
        })
        .where(eq(councils.id, opts.input.id))
        .returning();

      await Algolia.updateObjectFromIndex({
        name: opts.input.name ?? '',
        type: 'council',
        refID: slug || opts.input.id,
        content: opts.input.description + ' ' + opts.input.statement,
      });

      // Process members.
      for (const member of opts.input.members) {
        const foundMember = member?.id ? await db.query.members.findFirst({
          where: eq(members.id, member.id),
        }) : null;

        if (!foundMember) {
          // User doesn't exist, create a new user.
          await insertMember(member);
          continue; // Skip to next member.
        }

        await updateMember(foundMember.id, member);
      }

      return updatedCouncil[0];
    }),

  deleteCouncil: publicProcedure
    .input(
      councilInsertSchema
        .required({ id: true, slug: true })
        .pick({ id: true, slug: true }),
    )
    .mutation(async (opts) => {
      const userRole = opts.ctx.user?.role;
      checkUserRole(userRole);
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
          members: true,
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
          members: true,
        },
      });
    }),

  deleteUserFromCouncil: protectedProcedure
    .input(z.object({ id: z.number(), councilId: z.number() }))
    .use(isAdmin)
    .mutation(async (opts) => {
      const user = await db.query.members.findFirst({
        where: eq(members.id, opts.input.id),
      });
      if (!user) return;
      await db
        .delete(members)
        .where(
          and(
            eq(members.id, user.id),
            eq(members.councilId, opts.input.councilId),
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
