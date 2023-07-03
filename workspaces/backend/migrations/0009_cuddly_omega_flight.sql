CREATE TABLE IF NOT EXISTS "users_to_councils" (
	"user_id" uuid NOT NULL,
	"council_id" serial NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users_to_councils" ADD CONSTRAINT "users_to_councils_user_id_council_id" PRIMARY KEY("user_id","council_id");

ALTER TABLE "councils" ADD COLUMN "description" text;
ALTER TABLE "councils" ADD COLUMN "statement" text;
DO $$ BEGIN
 ALTER TABLE "users_to_councils" ADD CONSTRAINT "users_to_councils_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_to_councils" ADD CONSTRAINT "users_to_councils_council_id_councils_id_fk" FOREIGN KEY ("council_id") REFERENCES "councils"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
