DO $$ BEGIN
 CREATE TYPE "interests" AS ENUM('cairo_dev', 'daos', 'governance', 'identity', 'infrastructure', 'legal', 'professional_delegate', 'security', 'starknet_community', 'web3_community', 'web3_developer', 'nft', 'gaming', 'defi', 'build');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "delegate_votes" (
	"delegateId" uuid,
	"address" text NOT NULL,
	"votingPower" integer,
	"totalVotes" integer,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "delegates" RENAME COLUMN "delegateStatement" TO "statement";
ALTER TABLE "delegates" RENAME COLUMN "type" TO "interests";
DO $$ BEGIN
 ALTER TABLE "delegate_votes" ADD CONSTRAINT "delegate_votes_delegateId_delegates_id_fk" FOREIGN KEY ("delegateId") REFERENCES "delegates"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
