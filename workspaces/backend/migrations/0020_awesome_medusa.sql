ALTER TABLE "users" ADD COLUMN "starknetAddress" text;
ALTER TABLE "delegates" DROP COLUMN IF EXISTS "starknetWalletAddress";