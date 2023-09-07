import { graphqlClient } from "../utils/graphqlClient";
import {db} from "../db/db";


async function fetchVotingPower(delegateId) {
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

  const response = await graphqlClient.request(query);
  return response.vp;
}

async function fetchVoteCount(delegateId) {
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

  const response = await graphqlClient.request(query);
  return response.votes.length;
}

async function fetchDelegateData(delegateId) {
  const [votingPower, voteCount] = await Promise.all([
    fetchVotingPower(delegateId),
    fetchVoteCount(delegateId),
  ]);

  return {
    delegateId,
    votingPower: votingPower.vp,
    voteCount,
  };
}

async function processDelegatesInBatches(delegates, batchSize) {
  let batchStart = 0;

  while (batchStart < delegates.length) {
    const batchStartTime = Date.now(); // Record the start time of the batch
    const batchEnd = Math.min(batchStart + batchSize, delegates.length);
    console.log(batchEnd, batchStart, delegates.length)
    const delegateBatch = delegates.slice(batchStart, batchEnd);

    const delegateDataPromises = delegateBatch.map(delegateId => fetchDelegateData(delegateId));
    const delegateDataBatch = await Promise.all(delegateDataPromises);

    // await saveToDelegateVotes(delegateDataBatch);
    console.log(delegateDataBatch)

    batchStart = batchEnd;
    const batchEndTime = Date.now(); // Record the end time of the batch
    const timePassed = (batchEndTime - batchStartTime) / 1000; // Calculate the time passed in seconds

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
    if (delegates.length > 100) {
      return delegates.slice(0,100)
    } else {
      return delegates
    }
  } catch (error) {
    console.error('Error fetching delegates:', error);
    throw error
  }
}

export async function delegateVotes() {
  const delegates = await fetchAllDelegates();
  await processDelegatesInBatches(delegates, 5);
}
