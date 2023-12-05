import { router, protectedProcedure } from '../utils/trpc';
import { db } from '../db/db';
import axios from 'axios';
import { socials } from '../db/schema/socials';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const socialsRouter = router({
  initiateDiscordAuth: protectedProcedure
    .input(
      z.object({
        delegateId: z.string().optional(),
        originalURL: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { delegateId } = input;

      if (delegateId) {
        // Check if the user has already verified Discord
        const existingSocials = await db.query.socials.findFirst({
          where: eq(socials.delegateId, delegateId),
        });

        if (existingSocials && existingSocials.discordVerified) {
          return {
            discordUsername: existingSocials.discord,
            alreadyVerified: true,
          };
        }
      }

      const stateObject = {
        delegateId: delegateId,
        origin: 'discord',
      };
      const serializedState = encodeURIComponent(JSON.stringify(stateObject));

      // Generate Discord authentication URL
      const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${
        process.env.DISCORD_CLIENT_ID
      }&response_type=code&redirect_uri=${encodeURIComponent(
        process.env.DISCORD_REDIRECT_URI! as string,
      )}&scope=identify&state=${serializedState}`;

      // Redirect user to Discord's authentication page
      return { redirectUrl: discordAuthUrl, alreadyVerified: false };
    }),

  verifyDiscord: protectedProcedure
    .input(z.object({ code: z.string(), delegateId: z.string() }))
    .mutation(async ({ input }) => {
      const { code, delegateId } = input;

      // Exchange the code for a Discord access token
      const tokens = await exchangeCodeForAccessToken(code);
      console.log(tokens);

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
