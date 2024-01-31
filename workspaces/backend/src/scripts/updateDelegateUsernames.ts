import { db } from '../db/db';
import { Algolia } from '../utils/algolia';
import dotenv from 'dotenv';
import { User } from '../db/schema/users';
dotenv.config();

async function populateDelegatesWithUsernames() {
  try {
    console.log('Fetching delegates...');

    // Fetch all delegates
    const allDelegates = await db.query.delegates.findMany({
      with: {
        author: true,
      },
    });

    for (const delegate of allDelegates) {
      const user = delegate.author as User; // cast to User type

      if (user) {
        // Update Algolia with username
        console.log(`Updating delegate ${delegate.id} in Algolia`);
        await Algolia.updateObjectFromIndex({
          name: (user?.username || user?.ensName || user?.address) ?? '',
          type: 'delegate',
          address: user?.address,
          avatar: user?.profileImage || user?.ensAvatar || undefined,
          refID: delegate.id,
          content: delegate.statement + ' ' + delegate.interests,
        });
      }
    }

    console.log('Delegates updated successfully.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

populateDelegatesWithUsernames();
