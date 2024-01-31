ALTER TABLE "users_to_councils" DROP CONSTRAINT "users_to_councils_user_id_council_id";
ALTER TABLE "subscribers" ALTER COLUMN "confirmationToken" SET DEFAULT 'b5828104-01d0-4730-83f0-ee2a55791b07';
ALTER TABLE "users_to_councils" ADD CONSTRAINT "users_to_councils_user_id_council_id_pk" PRIMARY KEY("user_id","council_id");
ALTER TABLE "users" ADD COLUMN "ethAddress" text;
ALTER TABLE "users" ADD COLUMN "isOnboarded" boolean;
ALTER TABLE "users" ADD COLUMN "hasConnectedSecondaryWallet" boolean;