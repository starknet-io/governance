/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'councils'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "councils" DROP CONSTRAINT "<constraint_name>";
ALTER TABLE "councils" ALTER COLUMN "slug" DROP NOT NULL;
ALTER TABLE "users" ADD COLUMN "ensName" text;
ALTER TABLE "users" ADD COLUMN "ensAvatar" text;