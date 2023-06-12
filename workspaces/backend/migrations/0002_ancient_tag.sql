DO $$ BEGIN
 CREATE TYPE "delegateType" AS ENUM('Cairo Dev', 'DAOs', 'Governance', 'Identity', 'Infrastructure Starknet Dev', 'Legal', 'NFT', 'Professional Delegates', 'Security', 'Starknet Community', 'Web3 Community', 'Web3 Developer');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('last_call', 'active', 'review', 'pending');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "type" AS ENUM('discussion', 'vote');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "proposals" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" type,
	"status" status,
	"title" text,
	"content" text
);

ALTER TABLE "delegates" ADD COLUMN "delegateType" "delegateType";
ALTER TABLE "delegates" DROP COLUMN IF EXISTS "starknetType";