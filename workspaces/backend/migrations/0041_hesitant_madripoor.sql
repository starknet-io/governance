CREATE TABLE IF NOT EXISTS "stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"delegatedVSTRK" text DEFAULT '0',
	"delegatedSTRK" text DEFAULT '0',
	"selfDelegated" text DEFAULT '0',
	"totalVotingPower" text DEFAULT '0',
	"totalVoters" text DEFAULT '0',
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "subscribers" ALTER COLUMN "confirmationToken" SET DEFAULT '70875392-22ad-4a79-b524-ccbf4418e528';