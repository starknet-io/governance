DO $$ BEGIN
 CREATE TYPE "category" AS ENUM('category1', 'category2', 'category3');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "proposals" (
	"id" serial PRIMARY KEY NOT NULL,
	"proposal_id" text NOT NULL,
	"category" "category" NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
