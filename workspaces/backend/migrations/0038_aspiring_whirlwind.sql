CREATE TABLE IF NOT EXISTS "oauth_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"delegateId" uuid,
	"token" text,
	"tokenSecret" text,
	"provider" text,
	"expiration" timestamp NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "delegate_socials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"delegateId" uuid,
	"twitter" text,
	"discord" text,
	"telegram" text,
	"discourse" text,
	"twitterVerified" boolean DEFAULT false,
	"discordVerified" boolean DEFAULT false,
	"telegramVerified" boolean DEFAULT false,
	"discourseVerified" boolean DEFAULT false,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "subscribers" ALTER COLUMN "confirmationToken" SET DEFAULT 'c1da3fab-9493-4d35-b432-cb5c02b4fe73';
DO $$ BEGIN
 ALTER TABLE "oauth_tokens" ADD CONSTRAINT "oauth_tokens_delegateId_delegates_id_fk" FOREIGN KEY ("delegateId") REFERENCES "delegates"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "delegate_socials" ADD CONSTRAINT "delegate_socials_delegateId_delegates_id_fk" FOREIGN KEY ("delegateId") REFERENCES "delegates"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
