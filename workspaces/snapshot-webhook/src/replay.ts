import snapshot from '@snapshot-labs/snapshot.js';
import { EnumType } from 'json-to-graphql-query';
import db from './helpers/mysql';
import { capture } from '@snapshot-labs/snapshot-sentry';
import { handleCreatedEvent, handleDeletedEvent } from './events';

const hubURL = process.env.HUB_URL || 'https://hub.snapshot.org';

export let last_mci = 37321123;

async function getLastMci() {
  const query = 'SELECT value FROM _metadatas WHERE id = ? LIMIT 1';
  const results = await db.queryAsync(query, ['last_mci']);

  // Check if the results array is empty
  if (results.length === 0) {
    console.error('No last_mci found in _metadatas table');
    return null;
  }

  last_mci = parseInt(results[0].value);
  return last_mci;
}

async function getNextMessages(mci: number) {
  const query = {
    messages: {
      __args: {
        first: 10,
        where: {
          type_in: ['proposal'],
          mci_gt: mci,
          space: process.env.SNAPSHOT_SPACE,
        },
        orderBy: 'mci',
        orderDirection: new EnumType('asc')
      },
      mci: true,
      id: true,
      ipfs: true,
      type: true,
      timestamp: true
    }
  };

  try {
    const results = await snapshot.utils.subgraphRequest(`${hubURL}/graphql`, query);
    return results.messages;
  } catch (e: any) {
    capture(e, { contexts: { input: { query, mci } } });
    console.log('Failed to load messages', e);
    return;
  }
}

async function updateLastMci(mci: number) {
  const query = `
    INSERT INTO _metadatas (id, value)
    VALUES ('last_mci', ?)
    ON DUPLICATE KEY UPDATE value = VALUES(value);
  `;
  await db.queryAsync(query, [mci.toString()]);
}

async function processMessages(messages: any[]) {
  console.log(messages);
  let lastMessageMci = null;
  for (const message of messages) {
    console.log('time of message: ', new Date(message.timestamp * 1000), message.timestamp);
    try {
      if (message.type === 'proposal') {
        console.log('New event: "proposal"', message.space, message.id);
        await handleCreatedEvent({ id: `proposal/${message.id}`, space: message.space });
      }

      if (message.type === 'delete-proposal') {
        console.log('New event: "delete-proposal"', message.space, message.id);
        await handleDeletedEvent({
          space: message.space,
          ipfs: message.ipfs
        });
      }

      lastMessageMci = message.mci;
    } catch (error) {
      capture(error);
      break;
    }
  }
  if (lastMessageMci !== null) {
    // Store latest message MCI
    await updateLastMci(lastMessageMci);
    console.log('[replay] Updated to MCI', lastMessageMci);
  }
  return;
}

export async function run() {
  // Check latest indexed MCI from db
  let lastMci = await getLastMci();

  if (lastMci === null) {
    console.error('Cannot proceed as lastMci is not defined.');
    // Handle this scenario, e.g., by setting a default lastMci or just return to stop the process
    lastMci = 37320987;
  }

  console.log('[replay] Last MCI', lastMci);

  // Load next messages after latest indexed MCI
  const messages = await getNextMessages(lastMci);
  if (messages && messages.length > 0) {
    await processMessages(messages);
  }

  // Run again after 10sec
  await snapshot.utils.sleep(10e3);
  return run();
}
