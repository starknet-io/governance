ALTER TABLE "proposals" ADD COLUMN "userId" uuid;
DO $$ BEGIN
 ALTER TABLE "proposals" ADD CONSTRAINT "proposals_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
