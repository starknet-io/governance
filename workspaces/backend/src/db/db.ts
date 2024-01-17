import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as fs from 'fs';
import dotenv from 'dotenv';

import * as comments from './schema/comments';
import * as commentVotes from './schema/commentVotes';
import * as councils from './schema/councils';
import * as delegates from './schema/delegates';
import * as delegatesVotes from './schema/delegatesVotes';
import * as pages from './schema/pages';
import * as posts from './schema/posts';
import * as snips from './schema/snips';
import * as users from './schema/users';
import * as members from './schema/members';
import * as votes from './schema/votes';
import * as notifications from './schema/notifications';
import * as subscribers from './schema/subscribers';
import * as usersToCouncils from './schema/usersToCouncils';
import * as proposals from './schema/proposals';
import * as customDelegateAgreement from './schema/customDelegateAgreement';
import * as notificationUsers from './schema/notificationUsers';
import * as socials from './schema/socials';
import * as oauthTokens from './schema/oauthTokens';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: {
  //   ca: fs.readFileSync('ca-certificate.crt').toString(),
  // },
});

const db = drizzle(pool, {
  schema: {
    ...comments,
    ...commentVotes,
    ...councils,
    ...delegates,
    ...delegatesVotes,
    ...pages,
    ...posts,
    ...snips,
    ...users,
    ...votes,
    ...usersToCouncils,
    ...customDelegateAgreement,
    ...proposals,
    ...notifications,
    ...notificationUsers,
    ...subscribers,
    ...members,
    ...socials,
    ...oauthTokens
  },
});

migrate(db, { migrationsFolder: './migrations' });

export { db, pool };
