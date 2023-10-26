import { capture } from '@snapshot-labs/snapshot-sentry';
import db from '../helpers/mysql';
import { sha256 } from '../helpers/utils';
import { timeOutgoingRequest } from '../helpers/metrics';
import axios from 'axios';

const HTTP_WEBHOOK_TIMEOUT = 15000;
const serviceEventsSalt = parseInt(process.env.SERVICE_EVENTS_SALT || '12345');

export async function sendEvent(event, to, proposal) {
  const method = 'POST';
  event.token = sha256(`${to}${serviceEventsSalt}`);
  event.secret = sha256(`${to}${serviceEventsSalt}`);
  const headerSecret = sha256(`${to}${process.env.SERVICE_EVENTS_SALT}`);
  const url = 'http://localhost:8000/api/notifications/webhookHandler';
  console.log('URL: ', url);
  const end = timeOutgoingRequest.startTimer({ method, provider: 'http' });
  let res;

  const headers = {
    'Content-Type': 'application/json',
    Authentication: headerSecret
  };

  try {
    const stringifiedEvent = {
      json: {
        ...event,
        proposal
      }
    };
    const res = await axios.post(url, stringifiedEvent, {
      headers: headers,
      timeout: HTTP_WEBHOOK_TIMEOUT
    });
    //console.log(res)
    return true;
  } catch (error: any) {
    if (error.message.includes('network timeout')) {
      console.error('[webhook] request timed out', url);
    } else {
      console.error('[webhook] request error', url, JSON.stringify(error));
    }
    throw error;
  } finally {
    end({ status: res?.status || 0 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function send(event, _proposal, _subscribersAddresses) {
  const subscribers = await db.queryAsync('SELECT * FROM subscribers WHERE active = 1');
  console.log('[webhook] subscribers', subscribers.length);
  // _proposal.author
  // _proposal.title
  // _proposal.start
  // _proposal.id
  await sendEvent(event, 'governance', {
    author: _proposal.author,
    title: _proposal.title,
    start: _proposal.start,
    id: _proposal.id
  });

  Promise.allSettled(
    subscribers
      .filter(subscriber => [event.space, '*'].includes(subscriber.space))
      .map(subscriber => sendEvent(event, subscriber.url, subscriber.method))
  )
    .then(() => console.log('[webhook] process event done'))
    .catch(e => capture(e));
}
