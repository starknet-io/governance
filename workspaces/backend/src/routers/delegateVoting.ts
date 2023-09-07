import { graphqlClient } from '../utils/graphqlClient';
import { db } from '../db/db';
import { delegateVotes } from '../db/schema/delegatesVotes';
import { eq } from 'drizzle-orm';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function saveDelegateVotes(delegateDataBatch: any) {
  try {
    for (const delegateData of delegateDataBatch) {
      console.log(delegateData);
      const existingRecord = await db.query.delegateVotes.findFirst({
        where: eq(delegateVotes.delegateId, delegateData.delegateId),
      });

      if (existingRecord) {
        await db
          .update(delegateVotes)
          .set({
            votingPower: delegateData.votingPower,
            totalVotes: delegateData.totalVotes,
            updatedAt: new Date(),
          })
          .where(eq(delegateVotes.delegateId, delegateData.delegateId));
      } else {
        await db.insert(delegateVotes).values({
          delegateId: delegateData.delegateId,
          address: delegateData.address,
          votingPower: delegateData.votingPower,
          totalVotes: delegateData.totalVotes,
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

  const response: { votes: any[] } = await graphqlClient.request(query);
  return response.votes.length;
}

interface DelegateData {
  delegateId: string;
  votingPower: number;
  totalVotes: number;
  address: string;
}

async function fetchDelegateData(delegate: {
  address: string;
  id: string;
}): Promise<DelegateData> {
  try {
    const [votingPower, totalVotes] = await Promise.all([
      fetchVotingPower(delegate.address),
      fetchtotalVotes(delegate.address),
    ]);

    return {
      delegateId: delegate.id,
      address: delegate.address,
      votingPower: votingPower.vp,
      totalVotes,
    };
  } catch (error) {
    console.log(
      `Error fetching delegate data for delegate: ${delegate.address}:`,
      error,
    );
    throw error;
  }
}

async function processDelegatesInBatches(
  delegates: { address: string; id: string }[],
  batchSize: number,
) {
  let batchStart = 0;
  let failedBatches: { address: string; id: string }[] = [];
  const apiCallLimit = 29; // To stay below 64 API calls within 16 seconds - lowered to 58 just in case
  let apiCallCount = 0;

  while (batchStart < delegates.length) {
    const batchStartTime = Date.now();
    const batchEnd = Math.min(batchStart + batchSize, delegates.length);
    console.log(batchEnd, batchStart, delegates.length);
    const delegateBatch = delegates.slice(batchStart, batchEnd);
    apiCallCount += delegateBatch.length;

    if (apiCallCount >= apiCallLimit) {
      console.log('Approaching rate limit, pausing for 5 seconds...');
      await delay(5000); // 5 seconds pause
      apiCallCount = 0; // Reset the API call count
    }

    try {
      const delegateDataPromises = delegateBatch.map((delegate) =>
        fetchDelegateData(delegate),
      );
      const delegateDataBatch = await Promise.all(delegateDataPromises);

      await saveDelegateVotes(delegateDataBatch);
      console.log(delegateDataBatch);
    } catch (error) {
      console.log('Error processing delegate batch:', error);
      failedBatches = failedBatches.concat(delegateBatch);
    }

    batchStart = batchEnd;
    const batchEndTime = Date.now();
    const timePassed = (batchEndTime - batchStartTime) / 1000;

    console.log(`Time passed for this batch: ${timePassed} seconds`);
  }

  let retryCount = 0;
  const maxRetryCount = 5; // Set a max retry count to prevent infinite loop
  while (failedBatches.length > 0 && retryCount < maxRetryCount) {
    console.log(`Retrying failed batches: Attempt ${retryCount + 1}`);
    console.log(`Number of failed entries: ${failedBatches.length}`);

    let newFailedBatches: { address: string; id: string }[] = [];
    batchStart = 0;
    apiCallCount = 0; // Reset API call count before the retry loop

    while (batchStart < failedBatches.length) {
      const batchEndTime = Math.min(
        batchStart + batchSize,
        failedBatches.length,
      );
      const retryBatch = failedBatches.slice(batchStart, batchEndTime);

      apiCallCount += retryBatch.length;

      if (apiCallCount >= apiCallLimit) {
        console.log(
          'Approaching rate limit during retry, pausing for 5 seconds...',
        );
        await delay(5000); // 5 seconds pause
        apiCallCount = 0; // Reset the API call count
      }

      const retryPromises = retryBatch.map((failedBatch) =>
        fetchDelegateData(failedBatch)
          .then((delegateData) => saveDelegateVotes([delegateData]))
          .catch((error) => {
            console.log('Error processing failed batch on retry:', error);
            newFailedBatches.push(failedBatch);
          }),
      );

      await Promise.all(retryPromises);

      batchStart = batchEndTime;
    }

    failedBatches = newFailedBatches;
    retryCount += 1;
  }

  if (failedBatches.length === 0) {
    console.log('Job finished');
  } else {
    console.error('Job finished with errors');
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
          },
        },
      },
    });
    delegates = delegates.map((delegate) => ({
      id: delegate.id,
      address: delegate.author.address,
    }));
    return delegates;
  } catch (error) {
    console.log('Error fetching delegates:', error);
    throw error;
  }
}

export async function delegateVoting() {
  const delegates = await fetchAllDelegates();
  await processDelegatesInBatches(delegates, 5);
}
