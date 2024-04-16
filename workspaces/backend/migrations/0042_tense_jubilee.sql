ALTER TABLE "subscribers" ALTER COLUMN "confirmationToken" SET DEFAULT 'bc4bf68e-9a08-4fe4-b34a-cc3f057613dc';
ALTER TABLE "stats" ADD COLUMN "selfDelegatedTotal" text DEFAULT '0';