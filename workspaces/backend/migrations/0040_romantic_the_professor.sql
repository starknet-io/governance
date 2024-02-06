ALTER TABLE "subscribers" ALTER COLUMN "confirmationToken" SET DEFAULT '84e51f0b-5fe0-4995-8705-68f36af3f193';
ALTER TABLE "delegate_votes" ADD COLUMN "votingPowerLayerOne" integer DEFAULT 0;
ALTER TABLE "delegate_votes" ADD COLUMN "votingPowerLayerTwo" integer DEFAULT 0;
ALTER TABLE "delegate_votes" ADD COLUMN "totalVotesLayerOne" integer DEFAULT 0;
ALTER TABLE "delegate_votes" ADD COLUMN "totalVotesLayerTwo" integer DEFAULT 0;