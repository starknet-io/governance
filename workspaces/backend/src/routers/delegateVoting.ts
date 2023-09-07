import { graphqlClient } from "../utils/graphqlClient";
import { db } from "../db/db";
import { delegateVotes } from "../db/schema/delegatesVotes";
import { eq } from "drizzle-orm";

export async function saveDelegateVotes(delegateDataBatch: any) {
  try {
    for (const delegateData of delegateDataBatch) {
      const existingRecord = await db.query.delegateVotes.findFirst({
        where: eq(delegateVotes.delegateId, delegateData.delegateId),
      });

      if (existingRecord) {
        await db
          .update(delegateVotes)
          .set({
            votingPower: delegateData.votingPower,
            totalVotes: delegateData.voteCount,
            updatedAt: new Date(),
          })
          .where(eq(delegateVotes.delegateId, delegateData.delegateId));
      } else {
        await db
          .insert(delegateVotes)
          .values({
            delegateId: delegateData.delegateId,
            votingPower: delegateData.votingPower,
            totalVotes: delegateData.voteCount,
            updatedAt: new Date(),
          });
      }
    }
  } catch (error) {
    console.error('Error saving delegate votes:', error);
    throw error;
  }
}

async function fetchVotingPower(delegateId: string) {
  const query = `
    query VotingPower {
      vp (
        voter: "${delegateId}"
        space: "starknet.eth"
      ) {
        vp
        vp_by_strategy
        vp_state
      }
    }
  `;

  const response: { vp: number } = await graphqlClient.request(query);
  return response.vp;
}

async function fetchtotalVotes(delegateId: string) {
  const query = `
    query Vote {
      votes (
        where: {
          voter: "${delegateId}",
          space: "starknet.eth"
        }
      ) {
        id
      }
    }
  `;

  const response: { votes: any[]} = await graphqlClient.request(query);
  return response.votes.length;
}

interface DelegateData {
  delegateId: string;
  votingPower: number;
  totalVotes: number;
}

async function fetchDelegateData(delegateId: string): Promise<DelegateData> {
  try {
    const [votingPower, totalVotes] = await Promise.all([
      fetchVotingPower(delegateId),
      fetchtotalVotes(delegateId),
    ]);

    return {
      delegateId,
      votingPower: votingPower.vp,
      totalVotes,
    };
  } catch (error) {
    console.log(`Error fetching delegate data for delegateId ${delegateId}:`, error);
    throw error;
  }
}

async function processDelegatesInBatches(delegates: string[], batchSize: number) {
  let batchStart = 0;

  while (batchStart < delegates.length) {
    const batchStartTime = Date.now();
    const batchEnd = Math.min(batchStart + batchSize, delegates.length);
    console.log(batchEnd, batchStart, delegates.length)
    const delegateBatch = delegates.slice(batchStart, batchEnd);

    try {
      const delegateDataPromises = delegateBatch.map(delegateId => fetchDelegateData(delegateId));
      const delegateDataBatch = await Promise.all(delegateDataPromises);

      await saveDelegateVotes(delegateDataBatch);
      console.log(delegateDataBatch)
    } catch (error) {
      console.log('Error processing delegate batch:', error);
    }

    batchStart = batchEnd;
    const batchEndTime = Date.now();
    const timePassed = (batchEndTime - batchStartTime) / 1000;

    console.log(`Time passed for this batch: ${timePassed} seconds`);
  }
}

async function fetchAllDelegates() {
  try {
    let delegates = await db.query.delegates.findMany({
      columns: {
        id: true,
      },
      with: {
        author: {
          columns: {
            address: true,
          }
        }
      }
    })
    delegates = delegates.map((del) => del?.author?.address || "")
    if (delegates.length > 5) {
      return delegates.slice(0,5)
    } else {
      return delegates
    }
  } catch (error) {
    console.log('Error fetching delegates:', error);
    throw error
  }
}

export async function delegateVoting() {
  const delegates = await fetchAllDelegates();
  console.log('asda')
  await processDelegatesInBatches(delegates, 5);
}
