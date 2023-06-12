DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('user', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "delegates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"delegateStatement" text NOT NULL,
	"starknetType" text,
	"starknetWalletAddress" text,
	"twitter" text,
	"discord" text,
	"discourse" text,
	"agreeTerms" boolean,
	"understandRole" boolean,
	"userId" uuid,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "users" ALTER COLUMN "address" SET NOT NULL;
ALTER TABLE "users" ADD COLUMN "role" "role" DEFAULT 'user' NOT NULL;
DO $$ BEGIN
 ALTER TABLE "delegates" ADD CONSTRAINT "delegates_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
