CREATE TABLE IF NOT EXISTS "custom_delegate_agreement" (
	"id" serial PRIMARY KEY NOT NULL,
	"delegate_id" uuid,
	"content" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "delegates" ADD COLUMN "confirmDelegateAgreement" boolean;
DO $$ BEGIN
 ALTER TABLE "custom_delegate_agreement" ADD CONSTRAINT "custom_delegate_agreement_delegate_id_delegates_id_fk" FOREIGN KEY ("delegate_id") REFERENCES "delegates"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
