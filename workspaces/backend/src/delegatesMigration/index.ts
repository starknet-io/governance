import dataDump from './starknet-delegates';
import { db } from '../db/db';
import { delegates } from '../db/schema/delegates';
import { users } from '../db/schema/users';
import slugify from 'slugify';
import { eq } from 'drizzle-orm';
import { customDelegateAgreement } from '../db/schema/customDelegateAgreement';
import { councils } from '../db/schema/councils';
import { usersToCouncils } from '../db/schema/usersToCouncils';
import { posts } from '../db/schema/posts';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import TurndownService from 'turndown';

const turndownService = new TurndownService();

const adminUsers = [
  '0x7cC03a29B9c9aBC73E797cD5D341cA58e3e9f744',
  '0x2eB998FB2B8Bcd77c1095EA5D1fe4807b6e2282e',
  '0x68Be7aDe3b4cF6CF8063f92882265a6492b6B33D',
  '0xb9A677edf29C080A80076dB94fbb4CbBF99bEf24',
  '0x77A653A468ded01fDfA4D78C0C23B35D1060A350',
  '0x106b1F88867D99840CaaCAC2dA91265BA6E93e2B',
];

async function createAdminUsers() {
  for (const address of adminUsers) {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.address, address),
    });

    if (!existingUser) {
      await db
        .insert(users)
        .values({
          publicIdentifier: address,
          address: address,
          ensName: null, // Set to a suitable value
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
    }
  }
}

async function createCouncils() {
  const councilsData = [
    {
      name: 'Builder Council',
      description: 'Description of Builder Council',
      statement: 'Statement of Builder Council',
    },
    {
      name: 'Security Council',
      description: 'Description of Security Council',
      statement: 'Statement of Security Council',
    },
  ];

  console.log('Creating Councils');

  for (const councilData of councilsData) {
    const existingCouncil = await db.query.councils.findFirst({
      where: eq(councils.name, councilData.name),
    });

    if (existingCouncil) {
      console.log(`Council ${councilData.name} already exists.`);
      continue; // Skip to the next council if this one already exists
    } else {
      console.log(`Creating Council ${councilData.name}.`);
    }

    const insertedCouncil = await db
      .insert(councils)
      .values({
        name: councilData.name,
        description: councilData.description,
        statement: councilData.statement,
        slug: slugify(councilData.name, { replacement: '_', lower: true }),
        address: 'dummy_address', // Adjust as necessary
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    const councilId = insertedCouncil[0].id;

    // Add admin users to council
    for (const address of adminUsers) {
      const user = await db.query.users.findFirst({
        where: eq(users.address, address),
      });
      if (user) {
        await db
          .insert(usersToCouncils)
          .values({
            userId: user.id,
            councilId: councilId,
          })
          .execute();
      }
    }

    console.log('Creating Posts');

    // Create dummy posts
    const dummyPosts = [
      {
        title: 'Dummy Post 1',
        content: 'Content of dummy post 1',
        councilId: councilId,
      },
      {
        title: 'Dummy Post 2',
        content: 'Content of dummy post 2',
        councilId: councilId,
      },
    ];

    for (const post of dummyPosts) {
      await db
        .insert(posts)
        .values({
          title: post.title,
          content: post.content,
          councilId: post.councilId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .execute();
    }

    console.log('Posts Created');
  }
}

async function seedData() {
  // First, create admin users if they don't exist
  console.log('Creating Admins');
  await createAdminUsers();
  console.log('Admins Created');

  // Second, create councils and add admin users if not exist
  await createCouncils();

  // Delegates seeding
  console.log('Creating delegates');
  for (const entry of dataDump) {
    const interestsStatements = entry.c4 ? JSON.parse(entry.c4) : [];
    const interests =
      interestsStatements?.find((item: any) => item.label === 'Interests')
        ?.value || [];
    const statement =
      interestsStatements?.find((item: any) => item.label === 'statement')
        ?.value || '';
    const statementMarkdown = turndownService.turndown(statement);


    // Step 1: Check if the user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.address, entry.c0),
    });

    let userId;
    if (!existingUser) {
      // Step 2: Insert new user if not exists
      const insertedUser = await db
        .insert(users)
        .values({
          publicIdentifier: entry.c0,
          address: entry.c0,
          ensName: entry.c1,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      userId = insertedUser[0].id;
    } else {
      userId = existingUser.id;
    }

    // Step 3: Check if the delegate exists
    const existingDelegate = await db.query.delegates.findFirst({
      where: eq(delegates.userId, userId),
    });

    if (!existingDelegate) {
      // Step 4: Insert new delegate if not exists
      const newDelegate = {
        userId: userId,
        delegateType: interests.map((interest: any) =>
          interest.toLowerCase().replace(/\s+/g, '_'),
        ),
        statement: statementMarkdown,
        twitter: entry.c5 === '@' + entry.c5 ? entry.c5 : null,
        discord: null,
        discourse: null,
        confirmDelegateAgreement: null,
        agreeTerms: true,
        understandRole: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const insertedDelegate = await db
        .insert(delegates)
        .values(newDelegate)
        .returning();
      const delegateId = insertedDelegate[0].id;

      if (entry.c6) {
        // Step 5: Insert the custom delegate agreement
        const newCustomAgreement = {
          delegateId: delegateId,
          content: entry.c6,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await db
          .insert(customDelegateAgreement)
          .values(newCustomAgreement)
          .execute();
      }
    }
  }
  console.log('Delegates created');
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
