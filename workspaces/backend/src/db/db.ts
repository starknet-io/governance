import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import migrateData from "../delegatesMigration";

import dotenv from 'dotenv';

import * as comments from './schema/comments';
import * as councils from './schema/councils';
import * as delegates from './schema/delegates';
import * as pages from './schema/pages';
import * as posts from './schema/posts';
import * as snips from './schema/snips';
import * as users from './schema/users';
import * as votes from './schema/votes';
import * as usersToCouncils from './schema/usersToCouncils';
import * as customDelegateAgreement from './schema/customDelegateAgreement';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, {
  schema: {
    ...comments,
    ...councils,
    ...delegates,
    ...pages,
    ...posts,
    ...snips,
    ...users,
    ...votes,
    ...usersToCouncils,
    ...customDelegateAgreement,
  },
});

migrate(db, { migrationsFolder: './migrations' });

migrateData()
  .then(() => {
    console.log("Migration completed.");
  })
  .catch(error => {
    console.error("An error occurred:", error);
  });


export { db, pool };
