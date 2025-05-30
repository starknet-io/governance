import { GraphQLClient } from 'graphql-request';
import { db } from '../db/db';
import { delegateVotes } from '../db/schema/delegatesVotes';
import { eq } from 'drizzle-orm';
import axios from 'axios';
import { getChecksumAddress } from 'starknet';
import { stats } from '../db/schema/stats';

const graphQLClientL2 = new GraphQLClient(
  'https://starknet-delegates.checkpoint.fyi',
  {
    headers: {
      'Content-Type': 'application/json',
    },
  },
);

const graphQLClient = new GraphQLClient('https://api.snapshot.box/graphql', {
  headers: {
    'Content-Type': 'application/json',
  },
});

const L1_ENDPOINT =
  'https://api.studio.thegraph.com/query/23545/delegates/version/latest';

function getUrl(uri: string) {
  const IPFS_GATEWAY: string =
    process.env.IPFS_GATEWAY || 'https://cloudflare-ipfs.com';
  const ipfsGateway = `https://${IPFS_GATEWAY}`;
  if (!uri) return null;
  if (
    !uri.startsWith('ipfs://') &&
    !uri.startsWith('ipns://') &&
    !uri.startsWith('https://') &&
    !uri.startsWith('http://')
  ) {
    return `${ipfsGateway}/ipfs/${uri}`;
  }

  const uriScheme = uri.split('://')[0];
  if (uriScheme === 'ipfs')
    return uri.replace('ipfs://', `${ipfsGateway}/ipfs/`);
  if (uriScheme === 'ipns')
    return uri.replace('ipns://', `${ipfsGateway}/ipns/`);
  return uri;
}

async function parseStrategyMetadata(metadata: string | null) {
  if (metadata === null) return null;
  if (!metadata.startsWith('ipfs://')) return JSON.parse(metadata);

  const strategyUrl = getUrl(metadata);
  if (!strategyUrl) return null;

  const res = await fetch(strategyUrl);
  return res.json();
}

function processStrategiesMetadata(
  parsedMetadata: any[],
  strategiesIndicies?: number[],
) {
  if (parsedMetadata.length === 0) return [];

  const maxIndex = Math.max(
    ...parsedMetadata.map((metadata) => metadata.index),
  );

  const metadataMap = Object.fromEntries(
    parsedMetadata.map((metadata) => [
      metadata.index,
      {
        name: metadata.data.name,
        description: metadata.data.description,
        decimals: metadata.data.decimals,
        symbol: metadata.data.symbol,
        token: metadata.data.token,
        payload: metadata.data.payload,
      },
    ]),
  );

  strategiesIndicies =
    strategiesIndicies || Array.from(Array(maxIndex + 1).keys());
  return strategiesIndicies.map((index) => metadataMap[index]) || [];
}

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

interface DelegateDataSnapshot {
  delegatedVotes: string;
  id: string;
}

async function getWhitelistStrategy() {
  const spaceVar =
    '0x05702362b68a350c1cae8f2a529d74fdbb502369ddcebfadac7e91da37636947'; //process.env.SNAPSHOT_X_SPACE;

  const query = `
    query spaceQuery($space: String!) {
       space(id: $space) {
         strategies_indicies
         strategies_parsed_metadata {
          data {
            symbol
            name
            decimals
            payload
            token
          }
          index
        }
       }
     }
  `;
  try {
    const spaceResponse: any = await graphQLClient.request(query, {
      space: spaceVar,
    });
    const strategies = processStrategiesMetadata(
      spaceResponse?.space?.strategies_parsed_metadata,
      spaceResponse?.space?.strategies_indicies,
    );

    const whitelistStrategy = (strategies || []).find(
      (strategy) => strategy?.name === 'Whitelist',
    );
    if (whitelistStrategy?.payload) {
      const delegateList = await parseStrategyMetadata(
        whitelistStrategy.payload,
      );
      const whitelistDelegates = (delegateList?.tree || [])?.map(
        (delegate: any) => {
          const votesBigInt = BigInt(delegate.votingPower);
          const divisor = BigInt(10 ** 18);
          const scaledVotes = votesBigInt / divisor;
          return {
            address: delegate.address,
            delegatedVotes: Number(scaledVotes),
          };
        },
      );
      return whitelistDelegates;
    }
    return [];
  } catch (err) {
    console.error(err);
  }
}

async function fetchAllDelegatesFromSnapshot({
  isL1,
  isL2,
  isSelfDelegation,
}: {
  isL1?: boolean;
  isL2?: boolean;
  isSelfDelegation?: boolean;
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
  const queryL2 = `
    query Delegates {
      delegates(orderBy: delegatedVotes, orderDirection: desc, first: 100000) {
        id
        delegatedVotes
        delegatedVotesRaw
      }
    }
  `;
  const querySelfDelegation = `
    query SelfDelegationDelegates {
      tokenholders(first: 100000) {
        id
        tokenBalance
        delegate {
          id
        }
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
      const response: any = await graphQLClientL2.request(queryL2);
      return response?.delegates || [];
    } else if (isSelfDelegation) {
      const response: any = await graphQLClientL2.request(querySelfDelegation);
      return response?.tokenholders || [];
    } else {
      return [];
    }
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

async function collectL2Data(delegates: DelegateDataSnapshot[]) {
  const total = delegates.reduce((acc, delegate) => {
    const votes = parseFloat(delegate?.delegatedVotes);
    acc += votes;
    return acc;
  }, 0);
  await db.update(stats).set({ delegatedVSTRK: total.toFixed(2).toString() });
  console.log('L2 total: ', parseFloat(total.toFixed(2)));
}

async function collectL1Data(delegates: DelegateDataSnapshot[]) {
  const total = delegates.reduce((acc, delegate) => {
    const votes = Math.round(Number(delegate?.delegatedVotes || 0));
    acc += votes;
    return acc;
  }, 0);
  await db.update(stats).set({ delegatedSTRK: total.toFixed(2).toString() });
  console.log('L1 total: ', total);
}

async function calculateTotalVotingPower(
  whitelist: any[],
  l1Vp: any[],
  l2Vp: any[],
) {
  let totalVotingPower = whitelist.reduce((acc, val) => {
    acc = acc + parseFloat(val?.delegatedVotes);
    return acc;
  }, 0);
  console.log('whitelist: ', totalVotingPower);
  totalVotingPower =
    totalVotingPower +
    l1Vp.reduce((acc, val) => {
      acc = acc + parseFloat(val?.delegatedVotes);
      return acc;
    }, 0);
  console.log('whitelist + l1: ', totalVotingPower);
  totalVotingPower =
    totalVotingPower +
    l2Vp.reduce((acc, val) => {
      acc = acc + parseFloat(val?.delegatedVotes);
      return acc;
    }, 0);
  console.log('whitelist + l1 + l2: ', totalVotingPower);
  await db.update(stats).set({
    totalVotingPower,
  });
}

async function calculateTotalVoters(
  whitelist: any[],
  l1Vp: DelegateDataSnapshot[],
  l2Vp: DelegateDataSnapshot[],
) {
  const allAddresses = [
    ...whitelist.map((d) => d.address.toLowerCase()),
    ...l1Vp.map((d) => d.id.toLowerCase()),
    ...l2Vp.map((d) => getChecksumAddress(d.id).toLowerCase()),
  ];

  const uniqueAddresses = new Set(allAddresses);
  const totalVoters = uniqueAddresses.size;

  console.log('Total unique voters:', totalVoters);

  try {
    await db.update(stats).set({ totalVoters: totalVoters.toString() });
    console.log('Total voters count updated successfully');
  } catch (error) {
    console.error('Error updating total voters count:', error);
    throw error;
  }
}

async function calculateSelfDelegatedTotal(tokenHolders: any[]){
  const total = tokenHolders.reduce((acc, tokenholder) => {
    if (tokenholder?.id && tokenholder?.tokenBalance && (tokenholder?.id === tokenholder?.delegate?.id)) {
      acc = acc + parseFloat(tokenholder?.tokenBalance)
    }
    return acc
  }, 0)
  await db.update(stats).set({
    selfDelegatedTotal: total,
  });
  console.log('self delegated: ', total)
}

export async function delegateVoting() {
  const pageSize = 1000;
  let page = 0;
  let hasMore = true;

  const dashboardStats = await db.query.stats.findMany({
    limit: 1, // We only need to check if at least one exists, so limit to 1
  });
  if (dashboardStats.length === 0) {
    console.log('inserting');
    await db.insert(stats).values({
      delegatedVSTRK: '0',
      delegatedSTRK: '0',
    });
  }
  const delegatesWhitelist = await getWhitelistStrategy();
  const delegatesSnapshotL1: DelegateDataSnapshot[] =
    await fetchAllDelegatesFromSnapshot({ isL1: true });
  const delegatesSnapshotL2: DelegateDataSnapshot[] =
    await fetchAllDelegatesFromSnapshot({ isL2: true });
  const tokenHolders = await fetchAllDelegatesFromSnapshot({ isSelfDelegation: true })
  await calculateSelfDelegatedTotal(tokenHolders)
  await collectL2Data(delegatesSnapshotL2);
  await collectL1Data(delegatesSnapshotL1);
  await calculateTotalVotingPower(
    delegatesWhitelist,
    delegatesSnapshotL1,
    delegatesSnapshotL2,
  );
  await calculateTotalVoters(
    delegatesWhitelist,
    delegatesSnapshotL1,
    delegatesSnapshotL2,
  );

  while (hasMore) {
    const localDelegatesBatch = await fetchAllDelegatesPaginated(
      pageSize,
      page,
    );

    if (localDelegatesBatch.length < pageSize) {
      hasMore = false; // This was the last page
    }

    for (const localDelegate of localDelegatesBatch) {
      const l1Delegate = delegatesSnapshotL1.find((d) => {
        return (
          d?.id?.toLowerCase() === localDelegate?.ethAddress?.toLowerCase()
        );
      });
      const l2Delegate = delegatesSnapshotL2.find(
        (d) =>
          getChecksumAddress(d?.id || '') ===
          getChecksumAddress(localDelegate?.starknetAddress || ''),
      );
      const whitelistDelegateL1 =
        delegatesWhitelist.find((d: any) => {
          return (
            d?.address?.toLowerCase() ===
            localDelegate?.ethAddress?.toLowerCase()
          );
        })?.delegatedVotes || 0;

      const whitelistDelegateL2 =
        delegatesWhitelist.find(
          (d: any) =>
            getChecksumAddress(d?.address || '') ===
            getChecksumAddress(localDelegate?.starknetAddress || ''),
        )?.delegatedVotes || 0;

      const votingPowerL1 =
        Math.round(Number(l1Delegate?.delegatedVotes || 0)) +
        whitelistDelegateL1;
      const votingPowerL2 =
        Math.round(Number(l2Delegate?.delegatedVotes || 0)) +
        whitelistDelegateL2;

      //console.log(votingPowerL1, votingPowerL2);

      if (votingPowerL1 > 0) {
        //console.log(localDelegate.ethAddress, 'L1', votingPowerL1);
      }
      if (votingPowerL2 > 0) {
        //console.log(localDelegate.starknetAddress, 'L2', votingPowerL2);
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
