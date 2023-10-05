import { z } from 'zod';
import { publicProcedure, router } from '../utils/trpc';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { TRPCError } from '@trpc/server';
import { db } from '../db/db';
import { users } from '../db/schema/users';
import { eq } from 'drizzle-orm';

export interface DecodedToken extends JwtPayload {
  new_user?: boolean;
  verified_credentials?: {
    address: string;
    chain: string;
    id: string;
    name_service: object;
    public_identifier: string;
    wallet_name: string;
    wallet_provider: string;
    format: string;
  }[];
}

dotenv.config();

const publicKey = process.env.DYNAMIC_PUBLIC_KEY || '';

export const authRouter = router({
  authUser: publicProcedure
    .input(
      z.object({
        authToken: z.string(),
        ensName: z.string().optional(),
        ensAvatar: z.string().optional(),
      }),
    )
    .mutation(async (opts) => {
      const token = opts.input.authToken;
      try {
        const decodedToken = await new Promise<DecodedToken>(
          (resolve, reject) => {
            jwt.verify(token, publicKey, (err, decoded) => {
              if (err) {
                reject(err);
              } else {
                resolve(decoded as DecodedToken);
              }
            });
          },
        );
        if (decodedToken.verified_credentials?.[0].address) {
          const lowerCaseAddress =
            decodedToken.verified_credentials[0].address.toLowerCase();

          const user = await db.query.users.findFirst({
            where: eq(users.address, lowerCaseAddress),
          });

          if (!user) {
            await db.insert(users).values({
              address: lowerCaseAddress, // save address as lowercase
              walletName: decodedToken.verified_credentials?.[0].wallet_name,
              walletProvider:
                decodedToken.verified_credentials?.[0].wallet_provider,
              publicIdentifier:
                decodedToken.verified_credentials?.[0].public_identifier,
              dynamicId: decodedToken.verified_credentials?.[0].id,
              ensName: opts.input.ensName,
              ensAvatar: opts.input.ensAvatar,
              createdAt: new Date(),
            });
          } else {
            await db
              .update(users)
              .set({
                walletName: decodedToken.verified_credentials?.[0].wallet_name,
                walletProvider:
                  decodedToken.verified_credentials?.[0].wallet_provider,
                publicIdentifier:
                  decodedToken.verified_credentials?.[0].public_identifier,
                dynamicId: decodedToken.verified_credentials?.[0].id,
                ensName: opts.input.ensName,
                ensAvatar: opts.input.ensAvatar,
                updatedAt: new Date(),
              })
              .where(
                eq(
                  users.address,
                  lowerCaseAddress, // save address as lowercase,
                ),
              );
          }
        }
        opts.ctx.res.cookie('JWT', opts.input.authToken, { httpOnly: true });
        return;
      } catch (err) {
        console.error(err);

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),

  logout: publicProcedure.mutation(async (opts) => {
    opts.ctx.res.clearCookie('JWT');
    opts.ctx.req.user = null;
    return;
  }),

  currentUser: publicProcedure.query(async (opts) => {
    try {
      if (opts.ctx.user) {
        return opts.ctx.user;
      }
      return null;
    } catch (err) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
  }),
});
