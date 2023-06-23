ALTER TABLE "proposals" RENAME TO "snips";
ALTER TABLE "votes" RENAME COLUMN "proposal_id" TO "snip_id";
ALTER TABLE "comments" DROP CONSTRAINT "comments_proposal_id_proposals_id_fk";

ALTER TABLE "votes" DROP CONSTRAINT "votes_proposal_id_proposals_id_fk";

ALTER TABLE "snips" DROP CONSTRAINT "proposals_userId_users_id_fk";

ALTER TABLE "comments" ALTER COLUMN "proposal_id" SET DATA TYPE text;
ALTER TABLE "comments" ADD COLUMN "snip_id" integer;
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_snip_id_snips_id_fk" FOREIGN KEY ("snip_id") REFERENCES "snips"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "votes" ADD CONSTRAINT "votes_snip_id_snips_id_fk" FOREIGN KEY ("snip_id") REFERENCES "snips"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "snips" ADD CONSTRAINT "snips_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
