CREATE TABLE IF NOT EXISTS "snip_versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"snipId" integer,
	"version" text,
	"description" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "comments" DROP CONSTRAINT "comments_snip_id_snips_id_fk";

ALTER TABLE "comments" ADD COLUMN "snipVersionId" integer;
ALTER TABLE "snips" ADD COLUMN "latestVersionId" integer;
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_snipVersionId_snip_versions_id_fk" FOREIGN KEY ("snipVersionId") REFERENCES "snip_versions"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "snips" ADD CONSTRAINT "snips_latestVersionId_snip_versions_id_fk" FOREIGN KEY ("latestVersionId") REFERENCES "snip_versions"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "comments" DROP COLUMN IF EXISTS "snip_id";
DO $$ BEGIN
 ALTER TABLE "snip_versions" ADD CONSTRAINT "snip_versions_snipId_snips_id_fk" FOREIGN KEY ("snipId") REFERENCES "snips"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
