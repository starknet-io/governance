import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { DecodedToken } from '../routers/auth';
import { db } from '../db/db';
import { User, users } from '../db/schema/users';
import { eq } from 'drizzle-orm';


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


export const getUserByJWT = async (token: string): Promise<User | undefined> => {
  const walletAddress = await getWalletAddressFromPrivateKey(token);
  if (!walletAddress) {
    return undefined;
  }
  const user = await db.select().from(users).where(eq(users.address, walletAddress.toLowerCase()));
  return user[0];
}
