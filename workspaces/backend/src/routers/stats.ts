import { router, publicProcedure } from '../utils/trpc';
import { db } from '../db/db';

export const statsRouter = router({
  getStats: publicProcedure.query(async () => {
    const dashboardStats = await db.query.stats.findFirst({});
    return {
      l2Delegated: parseFloat(dashboardStats?.delegatedVSTRK || '0'),
      l1Delegated: parseFloat(dashboardStats?.delegatedSTRK || '0'),
      selfDelegatedTotal: parseFloat(dashboardStats?.selfDelegatedTotal || '0'),
      totalVotingPower: parseFloat(dashboardStats?.totalVotingPower || '0'),
      totalVoters: parseFloat(dashboardStats?.totalVoters || '0'),
    };
  }),
});
