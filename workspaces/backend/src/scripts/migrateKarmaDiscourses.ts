import { db } from '../db/db';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';
import { socials } from '../db/schema/socials';
dotenv.config();

async function migrateKarmaDiscourses() {
  console.log('Fetching delegates');
  const allDelegates = await db.query.delegates.findMany({});

  if (!allDelegates) {
    return;
  }

  allDelegates.forEach((delegate) => console.log(delegate.discourse));
  for (const delegate of allDelegates) {
    const existingSocials = await db.query.socials.findFirst({
      where: eq(socials.delegateId, delegate.id),
    });
    if (delegate.discourse) {
      if (existingSocials) {
        console.log('Delegate has discourse and exists: ', delegate.discourse);
        await db.update(socials).set({
          discourse: delegate.discourse,
        });
      } else {
        console.log('Delegate has discourse: ', delegate.discourse);
        await db.insert(socials).values({
          delegateId: delegate.id,
          discourse: delegate.discourse,
        });
      }
    }
  }
}
export default migrateKarmaDiscourses();
