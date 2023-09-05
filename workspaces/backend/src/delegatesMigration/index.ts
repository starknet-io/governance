import dataDump from "./starknet-delegates";
import { db } from '../db/db'; // Replace with the actual path to your db file
import { delegates } from "../db/schema/delegates";
import {users} from "../db/schema/users";
import {eq} from "drizzle-orm";

let counter = 0;


async function migrateData() {
  for (const entry of dataDump) {
    counter ++ ;
    if (counter > 20) {
      return
    }
    const interestsStatements = JSON.parse(entry.c4);
    const interests = interestsStatements?.find(item => item.label === "Interests")?.value || [];
    const statement = interestsStatements?.find(item => item.label === "statement")?.value || "";

    // Step 1: Check if the user exists

    const existingUser = await db.query.users.findFirst({
      where: eq(users.address, entry.c0)
    });
    console.log(existingUser)

    let userId;
    if (!existingUser) {
      // Step 2: Insert new user if not exists
      const newUser = {
        publicIdentifier: entry.c0,
        address: entry.c0,
        ensName: entry.c1,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const insertedUser = await db.insert(users).values({ ... newUser }).returning();
      userId = insertedUser[0].id; // Assuming the insert method returns the inserted record
    } else {
      userId = existingUser.id; // Get the user ID from the existing record
    }

    const newDelegate = {
      userId: userId,
      delegateStatement: statement,
      delegateType: interests.map(interest => interest.toLowerCase().replace(/\s+/g, '_')),
      twitter: entry.c5 === '@' + entry.c5 ? entry.c5 : null,
      discord: null,
      discourse: null,
      confirmDelegateAgreement: !!entry.c6,
      agreeTerms: true,
      understandRole: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log(newDelegate)

    await db.insert(delegates).values({
      ...newDelegate
    }).execute();
  }
}

export default migrateData
