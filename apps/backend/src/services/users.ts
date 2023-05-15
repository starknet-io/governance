import { NewUser, User, users } from "../db/schema";
import { db } from "../db/db";
import { eq } from "drizzle-orm";

export const userService = {

  getAll: async (): Promise<User[]> => {
    return await db.select().from(users);
  },

  saveUser: async (user: NewUser): Promise<User> => {
    const newUser: NewUser = {
      fullName: user.fullName,
      lastName: user.lastName,
    };

    const insertedUser = await db.insert(users).values(newUser).returning();
    return insertedUser[0];
  },

  editUser: async (user: User): Promise<User> => {
    const editedUser: NewUser = {
      fullName: user.fullName,
      lastName: user.lastName,
    };

    const updatedUser = await db.update(users).set(editedUser).where(eq(users.id, user.id)).returning();
    return updatedUser[0];
  },

  deleteUser: async (id: number) => {
    await db.delete(users).where(eq(users.id, id)).execute();
  }

};