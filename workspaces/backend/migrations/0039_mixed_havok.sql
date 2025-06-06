CREATE TABLE IF NOT EXISTS "old_votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"delegateId" uuid,
	"proposalId" text,
	"title" text,
	"body" text,
	"votePreference" integer,
	"voteCount" integer,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "users_to_councils" DROP CONSTRAINT "users_to_councils_user_id_council_id";
ALTER TABLE "subscribers" ALTER COLUMN "confirmationToken" SET DEFAULT '541620fd-498b-4adc-a041-6f3a123139da';
ALTER TABLE "users_to_councils" ADD CONSTRAINT "users_to_councils_user_id_council_id_pk" PRIMARY KEY("user_id","council_id");
DO $$ BEGIN
 ALTER TABLE "old_votes" ADD CONSTRAINT "old_votes_delegateId_delegates_id_fk" FOREIGN KEY ("delegateId") REFERENCES "delegates"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
