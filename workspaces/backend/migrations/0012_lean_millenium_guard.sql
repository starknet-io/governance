ALTER TABLE "councils" ADD COLUMN "address" text;
ALTER TABLE "posts" ADD COLUMN "councilId" text;
ALTER TABLE "posts" ADD COLUMN "userId" text;
ALTER TABLE "users" ADD COLUMN "name" text;
ALTER TABLE "users" ADD COLUMN "twitter" text;
ALTER TABLE "users" ADD COLUMN "miniBio" text;
ALTER TABLE "councils" DROP COLUMN IF EXISTS "enableUpdate";
ALTER TABLE "councils" DROP COLUMN IF EXISTS "enableComments";