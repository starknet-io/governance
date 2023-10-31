import { GraphQLClient } from 'graphql-request';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema/users';

import dotenv from 'dotenv';
dotenv.config();

const endpoint = 'https://hub.snapshot.org/graphql';

const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    'x-api-key': process.env.SNAPSHOT_API_KEY!,
  },
});

const rolesDictionary: any = {
  admins: 'admin',
  moderators: 'moderator',
  members: 'user',
};

interface SpaceInterface {
  id: string;
  name: string;
  about: string;
  network: string;
  symbol: string;
  members: string[];
  admins: string[];
  moderators: string[];
}

async function fetchAllUsersFromSpace() {
  const query = `
    query {
      space(id: "${process.env.SNAPSHOT_SPACE!}") {
        id
        name
        about
        network
        symbol
        members
        admins
        moderators
      }
    }
  `;

  const response: { space: SpaceInterface } =
    await graphqlClient.request(query);
  const allUsers = ['members', 'admins', 'moderators'].reduce(
    (acc: any, role) => {
      const castedRole = role as 'members' | 'admins' | 'moderators';
      const userArray = response?.space?.[castedRole] || [];
      const usersWithRole =
        userArray?.map((address: string) => ({
          address,
          role: rolesDictionary[role] as 'user' | 'moderator' | 'admin',
        })) || [];
      return acc.concat(usersWithRole);
    },
    [],
  );

  return allUsers;
}

const syncSnapshotUsers = async () => {
  console.log('First, get all users from snapshot');
  const allSnapshotSpaceUsers = await fetchAllUsersFromSpace();
  console.log('Now, for each user obtain a role');
  for (const user of allSnapshotSpaceUsers) {
    console.log('processing', user);
    const existingUser = await db.query.users.findFirst({
      where: eq(users.address, user.address.toLowerCase()),
    });
    // If user exists, update role
    if (existingUser) {
      await db.update(users).set({
        role: user.role,
      });
    } else {
      // if user is new, create one
      await db.insert(users).values({
        address: user.address.toLowerCase(), // save address as lowercase
        role: user.role,
      });
    }
  }
  console.log('Done processing');
};
export default syncSnapshotUsers();
