ALTER TYPE "delegateType" ADD VALUE 'cairo_dev';
ALTER TYPE "delegateType" ADD VALUE 'daos';
ALTER TYPE "delegateType" ADD VALUE 'governance';
ALTER TYPE "delegateType" ADD VALUE 'identity';
ALTER TYPE "delegateType" ADD VALUE 'infrastructure';
ALTER TYPE "delegateType" ADD VALUE 'legal';
ALTER TYPE "delegateType" ADD VALUE 'professional_delegate';
ALTER TYPE "delegateType" ADD VALUE 'security';
ALTER TYPE "delegateType" ADD VALUE 'starknet_community';
ALTER TYPE "delegateType" ADD VALUE 'web3_community';
ALTER TYPE "delegateType" ADD VALUE 'web3_developer';
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
