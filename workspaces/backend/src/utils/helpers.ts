import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { DecodedToken } from '../routers/auth';
import { db } from '../db/db';
import { User, users } from '../db/schema/users';
import { eq } from 'drizzle-orm';
import { delegates } from '../db/schema/delegates';


dotenv.config();

export const getWalletAddressFromPrivateKey = async (token: string): Promise<string | undefined> => {
  const publicKey = process.env.DYNAMIC_PUBLIC_KEY || '';
  let decodedToken: DecodedToken | null = null;

  try {
    decodedToken = await new Promise<DecodedToken>((resolve, reject) => {
      jwt.verify(token, publicKey, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded as DecodedToken);
        }
      });
    });
  } catch (err) {
    return undefined;
  }

  return decodedToken.verified_credentials?.[0].address || undefined;
};


export const getUserByJWT = async (token: string): Promise<User> => {
  const walletAddress = await getWalletAddressFromPrivateKey(token);
  if (!walletAddress) {
    throw new Error('No wallet address found');
  }
  const user = await db.select().from(users).where(eq(users.address, walletAddress));
  return user[0];
}

export const checkDelegation = async (token: string) => {
  const user = await getUserByJWT(token);
  if (!user) {
    throw new Error('No user found');
  }
  const delegation = await db.select().from(users).leftJoin(delegates, eq(delegates.userId, user.id));
  return delegation[0].delegates
}
