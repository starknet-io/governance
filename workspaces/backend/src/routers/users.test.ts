import { test, expect } from '@jest/globals';
import { appRouter } from '.';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

import { db } from '../db/db';
import { pool } from '../db/db';

describe('Users', () => {

  test('getUsers', async () => {
    const caller = await appRouter.createCaller({ session: null });

    const allUsers = await caller.users.getAll();

    expect(allUsers).toBeDefined()
  })

  test('saveUser', async () => {
    const caller = await appRouter.createCaller({ session: null });

    const newUser = {
      fullName: "John Doe",
      lastName: "Doe",
    };
    const createdUser = await caller.users.saveUser(newUser);

    expect(createdUser.fullName).toBe(newUser.fullName);

    await db.delete(users).where(eq(users.id, createdUser.id)).execute();
  })

  test('editUser', async () => {
    const caller = await appRouter.createCaller({ session: null });

    const newUser = {
      fullName: "John Doe",
      lastName: "Doe",
    };
    const createdUser = await caller.users.saveUser(newUser);

    const editedUser = {
      id: createdUser.id,
      fullName: "Jane Doe",
      lastName: "Doe",
    };
    const updatedUser = await caller.users.editUser(editedUser);

    expect(updatedUser.fullName).toBe(editedUser.fullName);

    await db.delete(users).where(eq(users.id, createdUser.id)).execute();
  })

  test('deleteUser', async () => {
    const caller = await appRouter.createCaller({ session: null });

    const newUser = {
      fullName: "John Doe",
      lastName: "Doe",
    };
    const createdUser = await caller.users.saveUser(newUser);

    await caller.users.deleteUser({ id: createdUser.id });

    const deletedUsers = await db.select().from(users).where(eq(users.id, createdUser.id));
    expect(deletedUsers.length).toBe(0);
  })

  afterAll(async () => {
    await pool.end(); // close the database connection
  });

});