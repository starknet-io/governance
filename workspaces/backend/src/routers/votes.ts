import { router, publicProcedure } from '../utils/trpc';
import { votes } from '../db/schema/votes';
import { db } from '../db/db';

// list(page, perPage, sortBy, filters)
// cast a vote

export const votesRouter = router({
  getAll: publicProcedure.query(() => db.select().from(votes)),
});
