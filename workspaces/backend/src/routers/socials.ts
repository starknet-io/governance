import { router, protectedProcedure } from '../utils/trpc';
import { db } from '../db/db';
import axios from 'axios';
import crypto from 'crypto';
import { socials } from '../db/schema/socials';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { OAuth } from 'oauth';
import { oauthTokens } from '../db/schema/oauthTokens';

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CLIENT_ID!;
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CLIENT_SECRET!;
const twitterOauth = new OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  TWITTER_CONSUMER_KEY! as string,
  TWITTER_CONSUMER_SECRET! as string,
  '1.0A',
  null, // Specify your callback URL here if required
  'HMAC-SHA1',
);

type SocialNetwork = 'twitter' | 'discord' | 'telegram' | 'discourse';

type Socials = {
  delegateId: string | null;
  id: string;
  twitter: string | null;
  discord: string | null;
  telegram: string | null;
  discourse: string | null;
  [key: string]: any; // This allows indexing with a string type
};

export const socialsRouter = router({
  initiateSocialAuth: protectedProcedure
    .input(
      z.object({
        delegateId: z.string().optional(),
        origin: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { delegateId, origin } = input;

      if (!delegateId) {
        throw new Error('Delegate id is missing');
      }

      // Check if the user has already verified their social accounts
      const existingSocials = await db.query.socials.findFirst({
        where: eq(socials.delegateId, delegateId),
      });

      if (!existingSocials) {
        await db.insert(socials).values({ delegateId });
      }

      const response = {
        twitter: { username: existingSocials?.twitter, redirectUrl: '' },
        discord: { username: existingSocials?.discord, redirectUrl: '' },
        telegram: { username: existingSocials?.telegram },
      };

      const stateObject = { delegateId, origin };
      const serializedState = encodeURIComponent(JSON.stringify(stateObject));

      if (!response.discord.username) {
        response.discord.redirectUrl = `https://discord.com/api/oauth2/authorize?client_id=${
          process.env.DISCORD_CLIENT_ID
        }&response_type=code&redirect_uri=${encodeURIComponent(
          process.env.DISCORD_REDIRECT_URI!,
        )}&scope=identify&state=${serializedState}`;
      }

      if (!response.twitter.username) {
        try {
          const twitterAuthUrl = (await getTwitterAuthUrl(
            delegateId,
          )) as string;
          response.twitter.redirectUrl = twitterAuthUrl;
        } catch (error) {
          console.error('Error getting Twitter Auth URL:', error);
          // Handle error appropriately
        }
      }

      return response;
    }),

  unlinkDelegateSocial: protectedProcedure
    .input(z.object({ origin: z.string(), delegateId: z.string() }))
    .mutation(async ({ input }) => {
      const { origin, delegateId } = input;

      const validOrigins: SocialNetwork[] = [
        'twitter',
        'discord',
        'telegram',
        'discourse',
      ];

      if (!validOrigins.includes(origin as SocialNetwork)) {
        throw new Error('Requested social network does not exist');
      }

      // Find the user's social connections
      const existingSocial = (await db.query.socials.findFirst({
        where: eq(socials.delegateId, delegateId),
      })) as Socials; // Cast to the defined type

      if (!existingSocial || !existingSocial[origin]) {
        throw new Error('Social network not connected');
      }

      // Update the socials table to disconnect the user from the specified network
      await db
        .update(socials)
        .set({ [origin]: null }) // Set the social network field to null and verified status to false
        .where(eq(socials.delegateId, delegateId))
        .execute();

      return { success: true, message: `Disconnected from ${origin}` };
    }),

  verifyDiscord: protectedProcedure
    .input(z.object({ code: z.string(), delegateId: z.string() }))
    .mutation(async ({ input }) => {
      const { code, delegateId } = input;

      // Exchange the code for a Discord access token
      const tokens = await exchangeCodeForAccessToken(code);

      // Fetch the user's Discord username
      const discordUsername = await fetchDiscordUsername(tokens.accessToken);

      const existingDelegatesSocials = await db.query.socials.findFirst({
        where: eq(socials.delegateId, delegateId),
      });

      if (existingDelegatesSocials) {
        // Update the delegate's socials with the Discord username and set verified to true
        await db
          .update(socials)
          .set({ discord: discordUsername })
          .where(eq(socials.delegateId, delegateId))
          .execute();
      } else {
        await db.insert(socials).values({
          delegateId,
          discord: discordUsername,
        });
      }

      return { discordUsername };
    }),
  verifyTelegram: protectedProcedure
    .input(
      z.object({
        delegateId: z.string(),
        telegramData: z.object({
          id: z.number(),
          first_name: z.string(),
          last_name: z.string().optional(),
          username: z.string().optional(),
          photo_url: z.string().optional(),
          auth_date: z.number(),
          hash: z.string(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      const { delegateId, telegramData } = input;

      // Perform Telegram data verification
      const isVerified = await verifyTelegramData(telegramData);
      if (!isVerified) {
        throw new Error('Telegram verification failed');
      }

      // Fetch or update the socials table
      const existingSocials = await db.query.socials.findFirst({
        where: eq(socials.delegateId, delegateId),
      });

      if (existingSocials) {
        return { telegramUsername: existingSocials.telegram };
      } else {
        await db.insert(socials).values({
          delegateId,
          telegram: telegramData.username,
        });

        return { telegramUsername: telegramData.username };
      }
    }),
  verifyTwitter: protectedProcedure
    .input(
      z.object({
        oauthToken: z.string(),
        oauthVerifier: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { oauthToken, oauthVerifier } = input;

      // Retrieve the token secret from the database
      const tokenData = await db.query.oauthTokens.findFirst({
        where: eq(oauthTokens.token, oauthToken),
      });

      if (!tokenData) {
        throw new Error('Token not found');
      }

      return new Promise((resolve, reject) => {
        twitterOauth.getOAuthAccessToken(
          oauthToken,
          tokenData.tokenSecret! as string,
          oauthVerifier,
          async function (
            error: any,
            oauthAccessToken: string,
            oauthAccessTokenSecret: string,
            results: any,
          ) {
            if (error) {
              console.error('Error getting OAuth access token:', error);
              reject(new Error('Failed to obtain OAuth access token'));
            } else {
              // Fetch user data from Twitter using oauthAccessToken
              try {
                const twitterUsername = await fetchTwitterUsername(
                  oauthAccessToken,
                  oauthAccessTokenSecret,
                );
                if (!twitterUsername) {
                  reject(new Error('Failed to fetch Twitter username'));
                  return;
                }

                // Update Socials
                await db
                  .update(socials)
                  .set({ twitter: twitterUsername })
                  .where(eq(socials.delegateId, tokenData.delegateId!))
                  .execute();

                // Cleanup - get rid of old tokens
                await db
                  .delete(oauthTokens)
                  .where(eq(oauthTokens.token, oauthToken))
                  .execute();

                resolve({ delegateId: tokenData.delegateId });
              } catch (fetchError) {
                console.error('Error fetching Twitter username:', fetchError);
                reject(new Error('Failed to fetch Twitter username'));
              }
            }
          },
        );
      });
    }),
});

// Helper function to exchange OAuth code for a Discord access token
async function exchangeCodeForAccessToken(code: string) {
  try {
    const params = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID! as string,
      client_secret: process.env.DISCORD_CLIENT_SECRET! as string,
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI! as string,
    });

    const response = await axios.post(
      'https://discord.com/api/oauth2/token',
      params,
    );
    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    };
  } catch (error) {
    console.error('Error exchanging code for access token:', error);
    throw new Error('Failed to exchange code for access token');
  }
}

// Helper function to fetch Discord username
async function fetchDiscordUsername(accessToken: string) {
  try {
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return userResponse.data.username;
  } catch (error) {
    console.error('Error exchanging code for access token:', error);
    throw new Error('Failed to obtain discord username');
  }
}

async function fetchTwitterUsername(
  oauthAccessToken: string,
  oauthAccessTokenSecret: string,
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    twitterOauth.get(
      'https://api.twitter.com/1.1/account/verify_credentials.json',
      oauthAccessToken, // oauth access token
      oauthAccessTokenSecret, // oauth access token secret
      function (error, data, response) {
        if (error) {
          console.error('Error fetching Twitter user data:', error);
          reject(null);
        } else {
          try {
            const parsedData = JSON.parse(data as string);
            resolve(parsedData.screen_name); // Assuming screen_name is the Twitter username
          } catch (parseError) {
            console.error('Error parsing Twitter response:', parseError);
            reject(null);
          }
        }
      },
    );
  });
}

async function getTwitterAuthUrl(delegateId: string) {
  return new Promise((resolve, reject) => {
    twitterOauth.getOAuthRequestToken(
      async function (error, oauthToken, oauthTokenSecret) {
        if (error) {
          reject(new Error('Failed to initiate Twitter authentication'));
        } else {
          try {
            await db.insert(oauthTokens).values({
              delegateId,
              token: oauthToken,
              tokenSecret: oauthTokenSecret,
              provider: 'twitter',
              expiration: new Date(Date.now() + 300000), // 5 minutes from now
            });
            resolve(
              `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`,
            );
          } catch (dbError) {
            reject(new Error('Failed to store OAuth token'));
          }
        }
      },
    );
  });
}

interface TelegramData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
  [key: string]: number | string | undefined;
}

async function verifyTelegramData(telegramData: TelegramData) {
  const secretKey = crypto
    .createHash('sha256')
    .update(process.env.TELEGRAM_BOT_TOKEN!)
    .digest();

  const dataCheckString = Object.keys(telegramData)
    .filter((key) => key !== 'hash')
    .sort()
    .map((key) => `${key}=${telegramData[key as keyof TelegramData]}`)
    .join('\n');

  const hash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  return hash === telegramData.hash;
}
