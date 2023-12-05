import { router, protectedProcedure } from '../utils/trpc';
import { db } from '../db/db';
import axios from 'axios';
import { socials } from '../db/schema/socials';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { OAuth } from 'oauth';
import { oauthTokens } from '../db/schema/oauthTokens';

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CLIENT_ID!;
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CLIENT_SECRET!;
// const TWITTER_AUTHORIZE_URL = 'https://api.twitter.com/oauth/authorize';
const twitterOauth = new OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  TWITTER_CONSUMER_KEY! as string,
  TWITTER_CONSUMER_SECRET! as string,
  '1.0A',
  null, // Specify your callback URL here if required
  'HMAC-SHA1',
);

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

      if (delegateId) {
        // Check if the user has already verified Discord
        const existingSocials = await db.query.socials.findFirst({
          where: eq(socials.delegateId, delegateId),
        });

        if (!existingSocials) {
          await db.insert(socials).values({
            delegateId,
          });
        }

        if (
          existingSocials &&
          origin === 'discord' &&
          existingSocials.discordVerified
        ) {
          return {
            discordUsername: existingSocials.discord,
            alreadyVerified: true,
          };
        } else if (
          existingSocials &&
          origin === 'twitter' &&
          existingSocials.twitter
        ) {
          return {
            twitterUsername: existingSocials.twitter,
            alreadyVerified: true,
          };
        }
      }

      const stateObject = {
        delegateId: delegateId,
        origin,
      };
      const serializedState = encodeURIComponent(JSON.stringify(stateObject));
      if (origin === 'discord') {
        // Generate Discord authentication URL
        const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${
          process.env.DISCORD_CLIENT_ID
        }&response_type=code&redirect_uri=${encodeURIComponent(
          process.env.DISCORD_REDIRECT_URI! as string,
        )}&scope=identify&state=${serializedState}`;

        // Redirect user to Discord's authentication page
        return { redirectUrl: discordAuthUrl, alreadyVerified: false };
      }

      if (origin === 'twitter') {
        return new Promise((resolve, reject) => {
          twitterOauth.getOAuthRequestToken(async function (
            error: any,
            oauthToken: string,
            oauthTokenSecret: string,
          ) {
            if (error) {
              console.error('Error getting OAuth request token:', error);
              reject(new Error('Failed to initiate Twitter authentication'));
            } else {
              // Store oauthToken and oauthTokenSecret in the database
              try {
                await db.insert(oauthTokens).values({
                  delegateId: delegateId,
                  token: oauthToken,
                  tokenSecret: oauthTokenSecret,
                  provider: 'twitter',
                  expiration: new Date(Date.now() + 300000), // e.g., 5 minutes from now
                });
                const twitterAuthUrl = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`;
                resolve({
                  redirectUrl: twitterAuthUrl,
                  alreadyVerified: false,
                });
              } catch (dbError) {
                console.error('Error storing OAuth token:', dbError);
                reject(new Error('Failed to store OAuth token'));
              }
            }
          });
        });
      }

      return {
        redirectUrl: null,
        alreadyVerified: false,
      };
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
          .set({ discord: discordUsername, discordVerified: true })
          .where(eq(socials.delegateId, delegateId))
          .execute();
      } else {
        await db.insert(socials).values({
          delegateId,
          discord: discordUsername,
          discordVerified: true,
        });
      }

      return { discordUsername };
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

      console.log(tokenData);

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
                console.log(oauthAccessToken);
                const twitterUsername = await fetchTwitterUsername(
                  oauthAccessToken,
                  oauthAccessTokenSecret,
                );
                console.log(twitterUsername);
                if (!twitterUsername) {
                  reject(new Error('Failed to fetch Twitter username'));
                  return;
                }

                // Update Socials
                await db
                  .update(socials)
                  .set({ twitter: twitterUsername, twitterVerified: true })
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
