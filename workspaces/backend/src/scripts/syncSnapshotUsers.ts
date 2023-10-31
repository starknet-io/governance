import { graphqlClient } from '../utils/graphqlClient';

interface SpaceInterface {
  id: string
  name: string
  about: string
  network: string
  symbol: string
  members: string[]
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
      }
    }
  `;

  const response: { space: SpaceInterface } = await graphqlClient.request(query);
  return response?.space?.members || [];
}
const syncSnapshotUsers = async() => {
  console.log('First, get all users from snapshot')
  const allSnapshotSpaceUsers = await fetchAllUsersFromSpace();
  console.log('Now, for each user obtain a role')
  for (const user of allSnapshotSpaceUsers) {
    console.log(user)
    // Check if user already exists

    // If yes, then update role

    // If no, then create user with role
  }
};
export default syncSnapshotUsers();
