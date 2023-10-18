import dataDump from './starknet-delegates';
import { db } from '../db/db';
import { delegates } from '../db/schema/delegates';
import { users } from '../db/schema/users';
import { eq } from 'drizzle-orm';
import { customDelegateAgreement } from '../db/schema/customDelegateAgreement';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import TurndownService from 'turndown';
import { Algolia } from '../utils/algolia';
import { delegateVotes } from '../db/schema/delegatesVotes';
import { createCouncils } from './seeders/councilSeeder';
import { createLearnSections } from './seeders/learnSeeder';
import { createAdminUsers } from './seeders/usersSeeder';
import { seedVotingProposals } from './seeders/votingProposalSeeder';

const turndownService = new TurndownService();

export const adminUsers = [
  '0x7cC03a29B9c9aBC73E797cD5D341cA58e3e9f744',
  '0x2eB998FB2B8Bcd77c1095EA5D1fe4807b6e2282e',
  '0x68Be7aDe3b4cF6CF8063f92882265a6492b6B33D',
  '0xb9A677edf29C080A80076dB94fbb4CbBF99bEf24',
  '0x77A653A468ded01fDfA4D78C0C23B35D1060A350',
  '0x106b1f88867d99840caacac2da91265ba6e93e2b',
];

async function seedData() {
  // Delegates seeding
  console.log('Creating delegates');
  /*
  c0 - address
  c1 - twitter
  c2 - ens name
  c3 - profile image
  c4 - voting power
  c5 - interests
  c6 - forum handle
  c7 - statements
   */
  for (const entry of dataDump) {
    // INTERESTS and STATEMENT - C5
    // -- - -- - -- - - - -- - - - - - -
    const interestsStatements = entry.c5 ? JSON.parse(entry.c5) : [];
    const interests =
      interestsStatements
        ?.find((item: any) => item.label === 'Interests')
        ?.value.map((interest: string) => {
          const parsedInterest = interest.toLowerCase().replace(/\s+/g, '_');
          if (parsedInterest === 'infrastructure_starknet_dev') {
            return 'infrastructure';
          }
          if (parsedInterest === 'professional_delegates') {
            return 'professional_delegate';
          }
          return parsedInterest;
        }) || [];

    const statement =
      interestsStatements?.find((item: any) => item.label === 'statement')
        ?.value || '';
    const statementMarkdown = turndownService.turndown(statement);
    // -- - -- - -- - - - -- - - - - - -
    console.log('existing user query');
    // Step 1: Check if the user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.address, entry.c0),
    });

    let userId;
    let user;
    if (!existingUser) {
      // Step 2: Insert new user if not exists
      console.log('try to insert user query');

      const insertedUser = await db
        .insert(users)
        .values({
          publicIdentifier: entry.c0,
          address: entry.c0,
          ensName: entry.c2,
          profileImage: entry.c3,
          twitter: entry.c1,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      userId = insertedUser[0].id;
      user = insertedUser[0];
    } else {
      userId = existingUser.id;
      user = existingUser;
    }

    // Step 3: Check if the delegate exists
    console.log('existing delegate query');

    const existingDelegate = await db.query.delegates.findFirst({
      where: eq(delegates.userId, userId),
    });

    if (!existingDelegate) {
      // Step 4: Insert new delegate if not exists
      console.log('new delegate query');

      const newDelegate = {
        userId: userId,
        interests,
        statement: statementMarkdown,
        twitter: entry.c1 ? `@${entry.c1}` : null,
        discord: null,
        discourse: entry.c6,
        confirmDelegateAgreement: null,
        agreeTerms: true,
        understandRole: true,
        isKarmaDelegate: true,
        isGovernanceDelegate: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const insertedDelegate = await db
        .insert(delegates)
        .values(newDelegate)
        .returning();
      const delegateId = insertedDelegate[0].id;
      console.log('Saving ', delegateId, ' for algolia');
      /*
      await Algolia.saveObjectToIndex({
        refID: delegateId,
        type: 'delegate',
        name: (userInfo.ensName || userInfo.address) as string,
        content: insertedDelegate[0].statement + ' ' + interests,
      });

       */
      if (entry.c4) {
        console.log('Adding voting power for delegate ', entry.c0 || entry.c2);
        await db.insert(delegateVotes).values({
          delegateId: delegateId,
          address: entry.c0,
          votingPower: parseInt(entry.c4),
          totalVotes: 0,
          updatedAt: new Date(),
        });
      }

      if (entry.c7) {
        const customAgreement = entry.c7.replace(/\\/g, '');

        // Step 5: Insert the custom delegate agreement
        const newCustomAgreement = {
          delegateId: delegateId,
          content: customAgreement,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await db
          .insert(customDelegateAgreement)
          .values(newCustomAgreement)
          .execute();
      }
    } else {
      console.log(
        'Updating delegate',
        existingDelegate.id,
        `(${user.ensName || user.address})`,
        ' in algolia',
      );
      /*
      await Algolia.updateObjectFromIndex({
        refID: existingDelegate.id,
        type: 'delegate',
        name: (userInfo.ensName || userInfo.address) as string,
        content: statementMarkdown + ' ' + interests.join(' '),
      });
       */
    }
  }
  console.log('Now, saving delegates to algolia:');
  const preparedDelegates = await db.query.delegates.findMany({
    with: {
      author: true,
    },
  });
  const delegatesForAlgolia = preparedDelegates.map((delegate) => {
    const delegateUser = delegate.author;
    return {
      refID: delegate.id,
      type: 'delegate' as 'voting_proposal' | 'council' | 'learn' | 'delegate',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      avatar: delegateUser?.profileImage || delegateUser?.ensAvatar || null,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      name: (delegateUser?.ensName || delegateUser?.address) as string,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      content: `${delegate.statement} ${delegate.interests.join(
        ' ',
      )}` as string,
    };
  });
  await Algolia.saveObjectsToIndex(delegatesForAlgolia);
  console.log('Delegates created');
  // Create admin users if they don't exist
  console.log('Creating Admins');
  await createAdminUsers();
  console.log('Admins Created');

  // Second, create councils and add admin users if not exist
  await createCouncils();

  // Find one admin user to pass to createLearnSections
  const oneAdminUser = await db.query.users.findFirst({
    where: eq(users.role, 'admin'),
  });

  console.log('Populate learn sections');
  // Then, create Learn sections
  await createLearnSections(oneAdminUser?.id || null);
  console.log('Learn section populated');

  await seedVotingProposals();
}

async function runMigrations() {
  try {
    console.log('Starting migrations...');
    await migrate(db, { migrationsFolder: './migrations' });
    console.log('Migration completed. Starting data seeding...');
    await seedData();
    console.log('Data seeding completed.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

export default runMigrations();
