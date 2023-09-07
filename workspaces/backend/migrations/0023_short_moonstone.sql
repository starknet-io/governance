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
	"votingPower" integer NOT NULL,
	"totalVotes" integer NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "delegate_votes" ADD CONSTRAINT "delegate_votes_delegateId_delegates_id_fk" FOREIGN KEY ("delegateId") REFERENCES "delegates"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
