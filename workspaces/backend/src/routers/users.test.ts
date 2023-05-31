import { test, expect } from '@jest/globals';
import { appRouter } from '.';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

import { db } from '../db/db';
import { pool } from '../db/db';

import httpMocks from 'node-mocks-http';

describe('Users', () => {

  test('getUsers', async () => {

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    const caller = await appRouter.createCaller({ req, res });

    const allUsers = await caller.users.getAll();

    expect(allUsers).toBeDefined()
  })

  test('saveUser', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    const caller = await appRouter.createCaller({ req, res });

    const newUser = {
      address: 'address',
      walletName: 'walletName',
      walletProvider: 'walletProvider',
      publicIdentifier: 'publicIdentifier',
      dynamicId: 'dynamicId',
    };

    const createdUser = await caller.users.saveUser(newUser);

    await db.delete(users).where(eq(users.id, createdUser.id)).execute();
  })

  test('editUser', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    const caller = await appRouter.createCaller({ req, res });

    const newUser = {
      address: 'address',
      walletName: 'walletName',
      walletProvider: 'walletProvider',
      publicIdentifier: 'publicIdentifier',
      dynamicId: 'dynamicId',
    };
    const createdUser = await caller.users.saveUser(newUser);

    const editedUser = {
      id: createdUser.id,
      address: 'updatedAddress'
    };
    const updatedUser = await caller.users.editUser(editedUser);

    expect(updatedUser.address).toBe(editedUser.address);

    await db.delete(users).where(eq(users.id, createdUser.id)).execute();
  })

  test('deleteUser', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    const caller = await appRouter.createCaller({ req, res });

    const newUser = {
      address: 'address',
      walletName: 'walletName',
      walletProvider: 'walletProvider',
      publicIdentifier: 'publicIdentifier',
      dynamicId: 'dynamicId',
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