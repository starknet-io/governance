ALTER TABLE "comments" DROP CONSTRAINT "comments_user_id_users_id_fk";

ALTER TABLE "delegates" DROP CONSTRAINT "delegates_userId_users_id_fk";

ALTER TABLE "snips" DROP CONSTRAINT "snips_userId_users_id_fk";

ALTER TABLE "users_to_councils" DROP CONSTRAINT "users_to_councils_user_id_users_id_fk";

ALTER TABLE "posts" ALTER COLUMN "userId" TYPE uuid USING "userId"::uuid;
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "delegates" ADD CONSTRAINT "delegates_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_councilId_councils_id_fk" FOREIGN KEY ("councilId") REFERENCES "councils"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "snips" ADD CONSTRAINT "snips_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_to_councils" ADD CONSTRAINT "users_to_councils_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
