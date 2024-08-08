ALTER TABLE "subscribers" ALTER COLUMN "confirmationToken" SET DEFAULT 'c58f74f3-839c-46f8-a72c-e1479cbaebd4';
ALTER TABLE "votes" ADD COLUMN "comment" text;
ALTER TABLE "votes" ADD COLUMN "voterAddress" text;
ALTER TABLE "votes" ADD COLUMN "proposalId" text;
