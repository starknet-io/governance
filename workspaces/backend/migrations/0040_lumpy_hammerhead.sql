ALTER TABLE "subscribers" ALTER COLUMN "confirmationToken" SET DEFAULT '1780a0fc-d5c2-42a0-8e93-f8d6e9379883';
ALTER TABLE "delegate_votes" ADD COLUMN "votingPowerLayerOne" integer DEFAULT 0;
ALTER TABLE "delegate_votes" ADD COLUMN "votingPowerLayerTwo" integer DEFAULT 0;
ALTER TABLE "delegate_votes" ADD COLUMN "totalVotesLayerOne" integer DEFAULT 0;
ALTER TABLE "delegate_votes" ADD COLUMN "totalVotesLayerTwo" integer DEFAULT 0;
ALTER TABLE "users" ADD COLUMN "ethAddress" text;
ALTER TABLE "users" ADD COLUMN "isOnboarded" boolean;
ALTER TABLE "users" ADD COLUMN "hasConnectedSecondaryWallet" boolean;