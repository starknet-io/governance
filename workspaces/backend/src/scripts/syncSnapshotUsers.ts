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
  members: 'author',
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
          role: rolesDictionary[role] as 'author' | 'moderator' | 'admin',
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
  console.log(allSnapshotSpaceUsers);
  let isSuperAdminProcessed = false;
  for (const user of allSnapshotSpaceUsers) {
    let superAdmin = false;
    const existingUser = await db.query.users.findFirst({
      where: eq(users.address, user.address.toLowerCase()),
    });
    if (user.role === 'admin' && !isSuperAdminProcessed) {
      superAdmin = true;
      isSuperAdminProcessed = true;
    } else {
      superAdmin = false;
    }
    const userRole = superAdmin ? 'superadmin' : user.role;
    console.log('Will set user: ', user.address, ' to role: ', userRole);
    // If user exists, update role
    if (existingUser) {
      await db
        .update(users)
        .set({
          role: userRole,
        })
        .where(eq(users.address, user.address));
    } else {
      // if user is new, create one
      await db.insert(users).values({
        address: user.address.toLowerCase(), // save address as lowercase
        role: userRole,
      });
    }
  }
  console.log('Done processing');
};
export default syncSnapshotUsers();
