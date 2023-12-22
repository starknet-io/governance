import { db } from '../db/db';
import { users } from '../db/schema/users';
import { eq } from 'drizzle-orm';
import { Algolia } from '../utils/algolia';
import { delegates } from '../db/schema/delegates';
import TurndownService from 'turndown';

const turndownService = new TurndownService();

const delegateInfo = {
  address: '',
  starknetAddress:
    '',
  ensName: '',
  delegateStatement: '',
  interests: [],
};

async function insertCustomDelegate(delegate = delegateInfo) {
  const userAddress = delegate.address;
  const existingUser = await db.query.users.findFirst({
    where: eq(users.address, userAddress),
  });

  if (existingUser) {
    console.log('User already exists');
  }

  try {
    let userId;
    let user;

    if (!existingUser) {
      const insertedUser = await db
        .insert(users)
        .values({
          publicIdentifier: '0xbE2fd46639EAe548552aA79b1245D65718cB89d9',
          address: '0xbE2fd46639EAe548552aA79b1245D65718cB89d9',
          ensName: '0xremiss.eth',
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      userId = insertedUser[0].id;
      user = insertedUser[0];
      console.log('User created');
    } else {
      userId = existingUser.id;
      user = existingUser;
    }

    const existingDelegate = await db.query.delegates.findFirst({
      where: eq(delegates.userId, userId),
    });

    if (existingDelegate) {
      console.log('Delegate already exists - terminating process');
      return
    }

    if (!existingDelegate) {
      // Step 4: Insert new delegate if not exists
      console.log('new delegate query');
      const statementMarkdown = turndownService.turndown(
        delegate.delegateStatement,
      );

      const newDelegate = {
        userId: userId,
        interests: delegate.interests,
        statement: statementMarkdown,
        twitter: null,
        discord: null,
        discourse: null,
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
      await Algolia.saveObjectToIndex({
        refID: delegateId,
        type: 'delegate',
        name: (user.ensName || user.address) as string,
        content: insertedDelegate[0].statement,
      });
    }
  } catch (err) {
    console.log('An error ocurred');
    console.error(err);
  }
}

insertCustomDelegate()
