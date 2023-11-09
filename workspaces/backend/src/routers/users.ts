import { router, publicProcedure, protectedProcedure } from '../utils/trpc';
import { z } from 'zod';
import { users } from '../db/schema/users';
import { db } from '../db/db';
import { eq, inArray } from 'drizzle-orm';
import { delegates } from '../db/schema/delegates';
import { Algolia } from '../utils/algolia';

export const usersRouter = router({
  getAll: protectedProcedure.query(() =>
    db.query.users.findMany({
      with: {
        delegationStatement: true,
      },
    }),
  ),

  saveUser: publicProcedure
    .input(
      z.object({
        address: z.string(),
        walletName: z.string(),
        walletProvider: z.string(),
        publicIdentifier: z.string(),
        dynamicId: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const insertedUser = await db
        .insert(users)
        .values({
          address: opts.input.address.toLowerCase(),
          walletName: opts.input.walletName,
          walletProvider: opts.input.walletProvider,
          publicIdentifier: opts.input.publicIdentifier,
          dynamicId: opts.input.dynamicId,
          createdAt: new Date(),
        })
        .returning();
      return insertedUser[0];
    }),

  isDelegate: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async (opts) => {
      const foundDelegate = await db.query.delegates.findFirst({
        where: eq(delegates.userId, opts.input.userId),
      });

      if (foundDelegate) {
        return foundDelegate;
      } else {
        return null;
      }
    }),

  editUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
        address: z.string().optional(),
        walletName: z.string().optional(),
        walletProvider: z.string().optional(),
        publicIdentifier: z.string().optional(),
        dynamicId: z.string().optional(),
        profileImage: z.string().optional() || z.null(),
      }),
    )
    .mutation(async (opts) => {
      const updatedUser = await db
        .update(users)
        .set({
          address: opts.input.address
            ? opts.input.address.toLowerCase()
            : opts.input.address,
          walletName: opts.input.walletName,
          walletProvider: opts.input.walletProvider,
          publicIdentifier: opts.input.publicIdentifier,
          dynamicId: opts.input.dynamicId,
          profileImage:
            opts.input.profileImage === 'none' ? null : opts.input.profileImage,
          updatedAt: new Date(),
        })
        .where(eq(users.id, opts.input.id))
        .returning();
      const user = updatedUser[0];
      if (opts.input.profileImage) {
        const delegate = await db.query.delegates.findFirst({
          where: eq(delegates.userId, user.id),
        });
        if (delegate) {
          await Algolia.updateObjectFromIndex({
            refID: delegate.id,
            avatar: opts.input.profileImage,
          });
        }
      }
      return user;
    }),

  deleteUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async (opts) => {
      await db.delete(users).where(eq(users.id, opts.input.id)).execute();
    }),

  addRoles: protectedProcedure
    .input(
      z.object({
        address: z.string(),
        role: z.any(),
      }),
    )
    .mutation(async (opts) => {
      const user = await db.query.users.findFirst({
        where: eq(users.address, opts.input.address.toLowerCase()),
      });
      if (user) {
        throw new Error('User already exists');
      } else {
        const createdUser = await db
          .insert(users)
          .values({
            address: opts.input.address.toLowerCase(),
            role: opts.input.role,
            createdAt: new Date(),
          })
          .returning();
        return createdUser[0];
      }
    }),

  editRoles: protectedProcedure
    .input(
      z.object({
        address: z.string(),
        role: z.any(),
      }),
    )
    .mutation(async (opts) => {
      const user = await db.query.users.findFirst({
        where: eq(users.address, opts.input.address.toLowerCase()),
      });
      if (!user) {
        throw new Error("User doesn't exists");
      } else {
        const updatedUser = await db
          .update(users)
          .set({
            role: opts.input.role,
          })
          .where(eq(users.address, opts.input.address.toLowerCase()))

          .returning();
        return updatedUser[0];
      }
    }),

  getUser: publicProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .query(async (opts) => {
      const user = await db.query.users.findFirst({
        where: eq(users.address, opts.input.address.toLowerCase()),
        with: {
          delegationStatement: true,
        },
      });
      return user;
    }),

  editUserProfile: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        username: z.optional(z.any()),
        starknetAddress: z.optional(z.any()),
        profileImage: z.optional(z.any()),
      }),
    )
    .mutation(async (opts) => {
      const { id, username, starknetAddress, profileImage } = opts.input;

      // Fetch the user by ID once instead of twice.
      const userById = await db.query.users.findFirst({
        where: eq(users.id, id),
      });

      // Ensure the user exists by ID.
      if (!userById) {
        throw new Error('User not found');
      }

      // If a username is provided, ensure it's unique.
      if (username !== undefined) {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.username, username),
        });

        if (existingUser) {
          throw new Error('Username already exists');
        }
      }

      // Handle potential nulls for updated fields.
      const updatedUsername =
        username === '' ? null : username || userById.username;
      const updatedAddress =
        starknetAddress !== undefined && starknetAddress !== ''
          ? starknetAddress
          : null;

      await db
        .update(users)
        .set({
          username: updatedUsername,
          starknetAddress: updatedAddress,
          profileImage: profileImage || userById.profileImage,
        })
        .where(eq(users.id, id))
        .returning();

      const foundUser = await db.query.users.findFirst({
        where: eq(users.id, id),
        with: {
          delegationStatement: true,
        },
      });

      if (foundUser?.profileImage) {
        const delegate = await db.query.delegates.findFirst({
          where: eq(delegates.userId, id),
        });
        if (delegate) {
          try {
            await Algolia.updateObjectFromIndex({
              refID: delegate.id,
              type: 'delegate',
              name: foundUser.ensName || foundUser.address,
              content: delegate.statement + delegate.interests,
              avatar: foundUser.profileImage,
            });
          } catch (err) {
            console.log(err);
          }
        }
      }
      return foundUser;
    }),

  me: protectedProcedure.query(async (opts) => {
    return opts.ctx.user;
  }),

  getUsersInfoByAddresses: publicProcedure
    .input(
      z.object({
        addresses: z.array(z.string()),
      }),
    )
    .query(async (opts) => {
      if (!opts.input?.addresses || !opts.input?.addresses?.length) {
        return {};
      }
      // Lowercase all provided addresses
      const lowercasedAddresses = opts.input.addresses.map((address) =>
        address.toLowerCase(),
      );

      // Fetch user info for each address in the provided array
      const foundUsers = await db.query.users.findMany({
        where: inArray(users.address, lowercasedAddresses),
        with: {
          delegationStatement: true,
        },
      });

      // Convert the array of users into an object where each key is an address
      const usersByAddress = foundUsers.reduce((acc: any, user) => {
        acc[user.address] = user;
        return acc;
      }, {});

      return usersByAddress;
    }),

  editUserProfileByAddress: protectedProcedure
    .input(
      z.object({
        address: z.string(),
        username: z.string().optional(),
        starknetAddress: z.string().optional(),
      }),
    )
    .mutation(async (opts) => {
      const user = await db.query.users.findFirst({
        where: eq(users.address, opts.input.address.toLowerCase()),
      });

      if (!user) {
        throw new Error('NOT_FOUND');
      }

      await db
        .update(users)
        .set({
          username: opts.input.username,
          starknetAddress: opts.input.starknetAddress,
          updatedAt: new Date(),
        })
        .where(eq(users.address, opts.input.address.toLowerCase()));

      return;
    }),
  banUser: protectedProcedure
    .input(
      z.object({
        id: z.string(), // ID of the user to be banned
        banned: z.boolean(),
      }),
    )
    .mutation(async (opts) => {
      const requester = opts.ctx.user;
      if (
        !requester ||
        (requester.role !== 'superadmin' &&
          requester.role !== 'admin' &&
          requester.role !== 'moderator')
      ) {
        throw new Error('You do not have permission to ban users');
      }

      const userToBan = await db.query.users.findFirst({
        where: eq(users.id, opts.input.id),
      });

      if (!userToBan) {
        throw new Error('User not found');
      }

      if (
        userToBan?.role === 'moderator' ||
        userToBan?.role === 'admin' ||
        userToBan?.role === 'superadmin'
      ) {
        throw new Error('Cannot ban moderators or admins');
      }

      if (userToBan.banned === opts.input.banned) {
        throw new Error('Banned status of user is the same');
      }

      const bannedUser = await db
        .update(users)
        .set({ banned: opts.input.banned })
        .where(eq(users.id, opts.input.id))
        .returning();

      return bannedUser[0];
    }),
});
