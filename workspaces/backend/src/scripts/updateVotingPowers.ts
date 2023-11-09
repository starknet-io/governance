import snapshot from '@snapshot-labs/snapshot.js';
import dotenv from 'dotenv';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';
import { GraphQLClient } from 'graphql-request';
import * as https from 'https';
import { delegateVotes } from '../db/schema/delegatesVotes';

dotenv.config();
console.log('start: ', Date.now())

interface BlockNumbers {
  [network: string]: number;
}

interface StrategyScore {
  [address: string]: number;
}

interface Strategy {
  name: string;
  params: Record<string, unknown>;
}

interface SpaceData {
  space: {
    name: string;
    strategies: Strategy[];
  };
}

const GET_SPACE_QUERY = `
  query GetSpaceQuery(
    $space: String!
  ) {
    space(id: $space) {
      name
      strategies {
        name
        params
      }
    }
  }
`;

const endpoint = `https://hub.snapshot.org/graphql`;
const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    'x-api-key': process.env.SNAPSHOT_API_KEY!,
  },
});

const fetchLatestBlockNumbers = (): Promise<BlockNumbers> => {
  return new Promise((resolve, reject) => {
    https
      .get('https://score.snapshot.org/', (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed.block_num as BlockNumbers);
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

const sortScoresDescending = (combinedScores: StrategyScore): StrategyScore => {
  const scoresArray = Object.entries(combinedScores);
  scoresArray.sort((a, b) => Number(b[1]) - Number(a[1]));
  const sortedScores: StrategyScore = {};
  scoresArray.forEach(([address, score]) => {
    sortedScores[address] = score;
  });
  return sortedScores;
};

const determineNetworkFromStrategy = (i: number) => {
  return '1';
};

const updateAllDelegates = async (sortedScores: StrategyScore) => {
  for (const [address, votingPower] of Object.entries(sortedScores)) {
    try {
      await db
        .update(delegateVotes)
        .set({
          votingPower: votingPower,
          updatedAt: new Date(), // Assuming updatedAt is a timestamp field
        })
        .where(eq(delegateVotes.address, address.toLowerCase()));
      //console.log('updated delegate: ', address, ' with voting power: ', votingPower);
    } catch (error) {
      console.error(
        'Error updating delegate vote for address:',
        address,
        error,
      );
    }
  }
  console.log('end: ', Date.now())

  console.log('All delegates updated successfully.');
};


// ... Rest of your code to call handleVotes()

const handleVotes = async () => {
  console.log('start: ', Date.now())
  const space: string = process.env.SNAPSHOT_CRON_SPACE!;
  const spaceData: SpaceData = await graphQLClient.request(GET_SPACE_QUERY, {
    space,
  });
  const blockNumbers: BlockNumbers = await fetchLatestBlockNumbers();

  const allStrategies = spaceData.space.strategies;
  const allDelegates = await db.query.delegates.findMany({
    with: {
      author: true,
    },
  });
  const voters: string[] = allDelegates.map(
    // @ts-ignore
    (delegate) => delegate.author?.address || '',
  );
  const apiKey: string = process.env.SNAPSHOT_API_KEY!;
  const url = `https://score.snapshot.org/?apiKey=${(apiKey as string) || ''}`;
  const combinedScores: StrategyScore = {};

  for (const [index, strategy] of allStrategies.entries()) {
    const network: string = determineNetworkFromStrategy(index);
    const snapshotTime: number = blockNumbers[network];
    try {
      const strategyScores: StrategyScore[] = await snapshot.utils.getScores(
        space,
        [strategy],
        network,
        voters,
        snapshotTime,
        url,
      );
      strategyScores.forEach((scoreObject: StrategyScore) => {
        Object.entries(scoreObject).forEach(([address, score]) => {
          combinedScores[address] = (combinedScores[address] || 0) + score;
        });
      });
    } catch (err) {
      console.error('Error fetching scores for strategy:', strategy.name, err);
    }
  }
  combinedScores[
    '0x5c04aa0e6896d5039bbeb4eecae8526a0a052a77'
  ] = 232323232;

  const sortedScores: StrategyScore = sortScoresDescending(combinedScores);
  //console.log('Sorted Scores:', sortedScores);
  await updateAllDelegates(sortedScores);
};

handleVotes();
//0x5c04aa0e6896d5039bbeb4eecae8526a0a052a77
