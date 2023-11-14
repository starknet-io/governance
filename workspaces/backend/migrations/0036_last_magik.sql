ALTER TABLE "subscribers" ADD COLUMN "confirmationToken" uuid DEFAULT 'uuid_generate_v4()' NOT NULL;
ALTER TABLE "subscribers" ADD COLUMN "isConfirmed" boolean DEFAULT false NOT NULL;