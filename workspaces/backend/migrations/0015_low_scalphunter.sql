ALTER TABLE "pages" ADD COLUMN "orderNumber" integer;
ALTER TABLE "pages" ADD COLUMN "userId" uuid;
DO $$ BEGIN
 ALTER TABLE "pages" ADD CONSTRAINT "pages_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
