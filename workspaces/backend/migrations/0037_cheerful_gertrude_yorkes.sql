CREATE TABLE IF NOT EXISTS "members" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" text,
	"twitter" text,
	"miniBio" text,
	"name" text,
	"council_id" integer
);

ALTER TABLE "subscribers" ALTER COLUMN "confirmationToken" SET DEFAULT '097b296a-080d-4e49-951c-353dc9fdd6cc';
DO $$ BEGIN
 ALTER TABLE "members" ADD CONSTRAINT "members_council_id_councils_id_fk" FOREIGN KEY ("council_id") REFERENCES "councils"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
