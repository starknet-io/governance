import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { TRPCError } from "@trpc/server";
import { db } from "../db/db";
import { users } from "../db/schema";
const crypto = require('crypto');

interface DecodedToken extends JwtPayload {
  new_user?: boolean;
  verified_credentials?: {
    address: string,
    chain: string,
    id: string,
    name_service: {},
    public_identifier: string,
    wallet_name: string,
    wallet_provider: string,
    format: string
  }[]
}

dotenv.config();

const publicKey = process.env.DYNAMIC_PUBLIC_KEY || '';

export const authRouter = router({

  authUser: publicProcedure
    .input(
      z.object({
        authToken: z.string()
      }))
    .mutation(async (opts) => {
      const token = opts.input.authToken
      jwt.verify(token, publicKey, async (err, decoded) => {
        const decodedToken = decoded as DecodedToken;
        try {
          if (decodedToken?.new_user) {
            await db.insert(users)
              .values({
                id: crypto.randomUUID(),
                address: decodedToken.verified_credentials?.[0].address,
                walletName: decodedToken.verified_credentials?.[0].wallet_name,
                walletProvider: decodedToken.verified_credentials?.[0].wallet_provider,
                publicIdentifier: decodedToken.verified_credentials?.[0].public_identifier,
                dynamicId: decodedToken.verified_credentials?.[0].id,
                createdAt: new Date(),
              })
          }
          opts.ctx.res.cookie('JWT', opts.input.authToken, { httpOnly: true })
          return
        } catch (err) {
          new TRPCError({
            code: "INTERNAL_SERVER_ERROR"
          });
        }
      });
    }
    ),
});