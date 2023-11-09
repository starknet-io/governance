import snapshot from '@snapshot-labs/snapshot.js';
import dotenv from 'dotenv';
import { db } from '../db/db';
import { GraphQLClient } from 'graphql-request';
import * as https from 'https';

dotenv.config();

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

const handleVotes = async () => {
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
  const url = `https://score.snapshot.org/?apiKey=${apiKey as string || ""}`;
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

  const sortedScores: StrategyScore = sortScoresDescending(combinedScores);
  console.log('Sorted Scores:', sortedScores);
};

handleVotes();
