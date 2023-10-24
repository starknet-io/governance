ALTER TABLE "notification_users" DROP CONSTRAINT "notification_users_userId_delegates_id_fk";

DO $$ BEGIN
 ALTER TABLE "notification_users" ADD CONSTRAINT "notification_users_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
