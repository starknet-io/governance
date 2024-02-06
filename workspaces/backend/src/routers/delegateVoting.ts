import { GraphQLClient } from 'graphql-request';
import { db } from '../db/db';
import { delegateVotes } from '../db/schema/delegatesVotes';
import { eq } from 'drizzle-orm';
import axios from 'axios';
import { getChecksumAddress } from 'starknet';

const graphQLClientL2 = new GraphQLClient(
  'https://starknet-delegates.checkpoint.fyi',
  {
    headers: {
      'Content-Type': 'application/json',
    },
  },
);

const L1_ENDPOINT =
  'https://api.studio.thegraph.com/query/23545/sepolia-delegates/version/latest';

export async function saveDelegateVotes(delegateData: any) {
  try {
    const existingRecord = await db.query.delegateVotes.findFirst({
      where: eq(delegateVotes.delegateId, delegateData.delegateId),
    });

    if (existingRecord) {
      await db
        .update(delegateVotes)
        .set({
          votingPower: delegateData.votingPower,
          votingPowerLayerOne: delegateData.votingPowerLayerOne,
          votingPowerLayerTwo: delegateData.votingPowerLayerTwo,
          updatedAt: new Date(),
        })
        .where(eq(delegateVotes.delegateId, delegateData.delegateId));
    } else {
      await db.insert(delegateVotes).values({
        delegateId: delegateData.delegateId,
        address: delegateData.address,
        votingPowerLayerOne: delegateData.votingPowerLayerOne,
        votingPowerLayerTwo: delegateData.votingPowerLayerTwo,
        votingPower: delegateData.votingPower,
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error('Error saving delegate votes:', error);
    throw error;
  }
}

interface DelegateData {
  delegateId: string;
  votingPower: number;
  totalVotes: number;
  address: string;
}

interface DelegateDataSnapshot {
  delegatedVotes: string;
  id: string;
}

async function fetchAllDelegatesFromSnapshot({
  isL1,
  isL2,
}: {
  isL1?: boolean;
  isL2?: boolean;
}) {
  const query = `
    query Delegates {
      delegates(orderBy: delegatedVotes, orderDirection: desc) {
        id
        delegatedVotes
        delegatedVotesRaw
      }
    }
  `;
  try {
    if (isL1) {
      const response = await axios.post(
        L1_ENDPOINT,
        {
          query: query,
          operationName: 'Delegates',
          extensions: {},
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data.data.delegates;
    } else if (isL2) {
      const response: any = await graphQLClientL2.request(query);
      return response?.delegates || [];
    } else {
      return [];
    }
  } catch (error) {
    console.log('Error fetching delegates:', error);
    throw error;
  }
}

async function fetchAllDelegates() {
  try {
    const delegates: any = await db.query.delegates.findMany({
      columns: {
        id: true,
      },
      with: {
        author: {
          columns: {
            address: true,
            ethereumAddress: true,
            starknetAddress: true,
          },
        },
      },
    });
    const parsedDelegates = delegates.map((delegate: any) => ({
      id: delegate.id,
      address: delegate?.author?.address || '',
    }));
    return parsedDelegates;
  } catch (error) {
    console.log('Error fetching delegates:', error);
    throw error;
  }
}

async function fetchAllDelegatesPaginated(pageSize: number, page: number) {
  try {
    // Fetch a page of delegates
    const delegates: any = await db.query.delegates.findMany({
      limit: pageSize,
      offset: page * pageSize,
      columns: {
        id: true,
      },
      with: {
        author: {
          columns: {
            address: true,
            ethAddress: true,
            starknetAddress: true,
          },
        },
      },
    });
    const parsedDelegates = delegates.map((delegate: any) => ({
      id: delegate.id,
      address: delegate?.author?.address || null,
      // if eth address not specified and address is different from starknet, it must belong to eth
      ethAddress:
        delegate?.author?.ethAddress ||
        (delegate?.author?.starknetAddress !== delegate?.author?.address
          ? delegate?.author?.address
          : null),
      starknetAddress: delegate?.author?.starknetAddress || null,
    }));
    return parsedDelegates;
  } catch (error) {
    console.error('Error fetching delegates:', error);
    throw error;
  }
}

export async function delegateVoting() {
  const pageSize = 100;
  let page = 0;
  let hasMore = true;

  const delegatesSnapshotL1: DelegateDataSnapshot[] =
    await fetchAllDelegatesFromSnapshot({ isL1: true });
  const delegatesSnapshotL2: DelegateDataSnapshot[] =
    await fetchAllDelegatesFromSnapshot({ isL2: true });

  while (hasMore) {
    const localDelegatesBatch = await fetchAllDelegatesPaginated(
      pageSize,
      page,
    );

    if (localDelegatesBatch.length < pageSize) {
      hasMore = false; // This was the last page
    }

    for (const localDelegate of localDelegatesBatch) {
      const l1Delegate = delegatesSnapshotL1.find(
        (d) => d.id.toLowerCase() === localDelegate.ethAddress?.toLowerCase(),
      );
      const l2Delegate = delegatesSnapshotL2.find(
        (d) =>
          getChecksumAddress(d.id || '') ===
          getChecksumAddress(localDelegate.starknetAddress || ''),
      );

      const votingPowerL1 = l1Delegate
        ? parseInt(l1Delegate.delegatedVotes)
        : 0;
      const votingPowerL2 = l2Delegate
        ? parseInt(l2Delegate.delegatedVotes)
        : 0;

      if (votingPowerL1 > 0) {
        console.log(localDelegate.ethAddress, 'L1', votingPowerL1);
      }
      if (votingPowerL2 > 0) {
        console.log(localDelegate.starknetAddress, 'L2', votingPowerL2);
      }

      // Combine the logic for saving/updating the delegate votes here
      ///console.log({...localDelegate, votingPowerL1, votingPowerL2});
      await saveDelegateVotes({
        delegateId: localDelegate.id,
        address: localDelegate.address,
        votingPowerLayerOne: votingPowerL1,
        votingPowerLayerTwo: votingPowerL2,
        votingPower: votingPowerL1 + votingPowerL2,
      });
    }

    page++; // Go to the next page
  }
}

delegateVoting();

export default delegateVoting;
