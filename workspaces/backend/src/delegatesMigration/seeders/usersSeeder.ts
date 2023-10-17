import {db} from "../../db/db";
import {eq} from "drizzle-orm";
import {users} from "../../db/schema/users";
import {adminUsers} from "../index";

export async function createAdminUsers() {
  for (const address of adminUsers) {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.address, address.toLowerCase()),
    });

    if (!existingUser) {
      await db
        .insert(users)
        .values({
          publicIdentifier: address.toLowerCase(),
          address: address.toLowerCase(),
          ensName: null, // Set to a suitable value
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
    } else {
      await db
        .update(users)
        .set({
          role: 'admin',
        })
        .where(eq(users.address, address.toLowerCase()))
        .returning();
    }
  }
}
