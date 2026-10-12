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

// SECURITY (F-23): Algorithms list is pinned explicitly to ES256 (issued by Dynamic).
// Without this restriction, jsonwebtoken accepts arbitrary algorithms specified in the token header,
// opening the classic JWT algorithm-confusion surface (e.g. `alg: none` or HMAC downgrade).
export const DYNAMIC_JWT_ALGORITHMS: jwt.Algorithm[] = ['ES256'];

// SECURITY (F-02): The session cookie requires SameSite=None when SPA and API reside on
// different domains. Because browsers send SameSite=None cookies with cross-site requests,
// CSRF protection is enforced via strict Origin validation in `src/index.ts`.
// Set COOKIE_SAMESITE=lax for single-origin deployments for stronger isolation.
const cookieSameSite = (process.env.COOKIE_SAMESITE === 'lax' ? 'lax' : 'none') as
  | 'lax'
  | 'strict'
  | 'none';

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: cookieSameSite,
  path: '/',
} as const;

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
            jwt.verify(token, publicKey, { algorithms: DYNAMIC_JWT_ALGORITHMS }, (err, decoded) => {
              if (err) {
                reject(err);
              } else {
                resolve(decoded as DecodedToken);
              }
            });
          },
        );
        if (decodedToken.verified_credentials?.[0]?.address) {
          const lowerCaseAddress =
            decodedToken.verified_credentials[0].address.toLowerCase();

          const user = await db.query.users.findFirst({
            where: eq(users.address, lowerCaseAddress),
          });

          let ethAddress: string | null = null;
          let starknetAddress: string | null = null;

          decodedToken.verified_credentials?.forEach((credential) => {
            if (credential.chain === 'eip155') {
              ethAddress = credential.address.toLowerCase();
            } else if (credential.chain === 'starknet') {
              starknetAddress = credential.address.toLowerCase();
            }
          });

          if (!user) {
            await db.insert(users).values({
              address: lowerCaseAddress,
              walletName: decodedToken.verified_credentials?.[0].wallet_name,
              walletProvider:
                decodedToken.verified_credentials?.[0].wallet_provider,
              publicIdentifier:
                decodedToken.verified_credentials?.[0].public_identifier,
              ethAddress: ethAddress,
              starknetAddress: starknetAddress,
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
                ethAddress: ethAddress,
                starknetAddress: starknetAddress,
                ensName: opts.input.ensName,
                ensAvatar: opts.input.ensAvatar,
                updatedAt: new Date(),
              })
              .where(
                eq(
                  users.address,
                  lowerCaseAddress,
                ),
              );
          }
        }
        opts.ctx.res.cookie('JWT', opts.input.authToken, SESSION_COOKIE_OPTIONS);
        return;
      } catch (err) {
        console.error(err);

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),

  logout: publicProcedure.mutation(async (opts) => {
    opts.ctx.res.clearCookie('JWT', { path: '/', secure: true, sameSite: cookieSameSite });
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
