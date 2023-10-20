CREATE TABLE IF NOT EXISTS "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message" text,
	"userId" uuid,
	"time" timestamp with time zone DEFAULT now() NOT NULL,
	"title" text,
	"type" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "notification_users" (
	"notificationId" uuid,
	"userId" uuid,
	"read" boolean DEFAULT false NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "notification_users" ADD CONSTRAINT "notification_users_notificationId_notifications_id_fk" FOREIGN KEY ("notificationId") REFERENCES "notifications"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "notification_users" ADD CONSTRAINT "notification_users_userId_delegates_id_fk" FOREIGN KEY ("userId") REFERENCES "delegates"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
