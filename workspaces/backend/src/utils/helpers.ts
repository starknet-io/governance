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

export const formatTimestamp = (unixTimestamp: number) => {
  const date = new Date(unixTimestamp * 1000);

  // You can adjust the format here by using the get methods
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-indexed
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  // Format: YYYY-MM-DD HH:mm:ss
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const getUrlBasedOnHost = (host: string) => {
  if (host.includes('review')) {
    return 'https://review.yuki-labs.dev/';
  } else if (host.includes('dev')) {
    return 'https://dev.yuki-labs.dev/';
  } else if (host.includes('localhost')) {
    return 'http://localhost:3000/';
  }
  return 'https://governance.starknet.io/';
};
