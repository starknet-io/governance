import { router, publicProcedure, protectedProcedure } from '../utils/trpc';
import { snips } from '../db/schema/snips';
import { db } from '../db/db';
import { desc, eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { comments } from '../db/schema/comments';

const snipInsertSchema = createInsertSchema(snips);

// list(page, perPage, sortBy, filters)
// create voting proposal
// create snip proposal

export const snipsRouter = router({
  getAll: publicProcedure.query(async () => {
    const data = await db.query.snips.findMany({
      with: {
        author: true,
        comments: true,
      },
    });
    return data;
  }),

  getSNIP: publicProcedure
    .input(snipInsertSchema.required({ id: true }).pick({ id: true }))
    .query(async (opts) => {
      const data = await db.query.snips.findFirst({
        where: eq(snips.id, opts.input.id),
        with: {
          author: true,
          comments: {
            with: {
              author: true,
            },
            orderBy: [desc(comments.createdAt)],
          },
        },
      });
      return data;
    }),
});
