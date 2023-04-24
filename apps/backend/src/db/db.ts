import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { migrate } from "drizzle-orm/node-postgres/migrator";

import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB_NAME,
});

const db = drizzle(pool);
migrate(db, { migrationsFolder: './migrations' });