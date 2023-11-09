import snapshot from '@snapshot-labs/snapshot.js';
import dotenv from 'dotenv';
import { db } from '../db/db';
import { GraphQLClient } from 'graphql-request';
import * as https from 'https';

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

const fetchLatestBlockNumbers = () => {
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
            resolve(parsed.block_num);
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

const sortScoresDescending = (combinedScores) => {
  // Convert the object into an array of [address, score] pairs
  let scoresArray = Object.entries(combinedScores);

  // Sort the array based on the scores in descending order, ensuring the scores are numbers
  scoresArray.sort((a, b) => Number(b[1]) - Number(a[1]));

  // Convert the sorted array back to an object
  let sortedScores = {};
  for (const [address, score] of scoresArray) {
    sortedScores[address] = score;
  }

  return sortedScores;
};

// Function to aggregate scores from multiple strategies
const aggregateStrategyScores = (strategiesScores) => {
  return strategiesScores.reduce((acc, strategyScores) => {
    Object.entries(strategyScores).forEach(([address, score]) => {
      if (!acc[address]) {
        acc[address] = 0;
      }
      acc[address] += score;
    });
    return acc;
  }, {});
};

dotenv.config();
const endpoint = `https://hub.snapshot.org/graphql`;

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    'x-api-key': process.env.SNAPSHOT_API_KEY!,
  },
});

dotenv.config();

const determineNetworkFromStrategy = (i: number) => {
  return "1"
};

const handleVotes = async () => {
  const space = 'starknet.eth';
  const spaceData = await graphQLClient.request(GET_SPACE_QUERY, {
    space: 'starknet.eth',
  });
  const blockNumbers: any = await fetchLatestBlockNumbers();

  const allStrategies = spaceData.space.strategies;
  const allDelegates = await db.query.delegates.findMany({
    with: {
      author: true,
    },
  });
  const voters = allDelegates.map(
    (delegate) => delegate?.author?.address || '',
  );
  const apiKey = process.env.SNAPSHOT_API_KEY;
  const url = `https://score.snapshot.org/?apiKey=${apiKey}`;
  let combinedScores = {};

  try {
    for (const [index, strategy] of allStrategies.entries()) {
      const network = determineNetworkFromStrategy(index);
      const snapshotTime = blockNumbers[network];
      try {
        const strategyScores = await snapshot.utils.getScores(
          space,
          [strategy],
          network,
          voters,
          snapshotTime,
          url,
        );
        // Properly merge strategy scores into combinedScores
        for (const scoreObject of strategyScores) {
          for (const [address, score] of Object.entries(scoreObject)) {
            if (
              address.toLowerCase() ===
              '0xef0133437ab8da5c5e8873b61189610e2d8cb4f5'
            ) {
              console.log('taj lik ', score);
            }
            combinedScores[address] = (combinedScores[address] || 0) + score;
          }
        }
      } catch (err) {
        console.error(
          'Error fetching scores for strategy:',
          strategy.name,
          err,
        );
      }
    }

    const sortedScores = sortScoresDescending(combinedScores);
    console.log('Sorted Scores:', sortedScores);
  } catch (err) {
    console.error(err);
  }
};

handleVotes();
