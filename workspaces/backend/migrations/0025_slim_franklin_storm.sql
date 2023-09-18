DO $$ BEGIN
 CREATE TYPE "voteType" AS ENUM('upvote', 'downvote');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "comment_votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"comment_id" integer NOT NULL,
	"vote_type" "voteType" NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "comments" ADD COLUMN "parent_id" integer;
ALTER TABLE "comments" ADD COLUMN "upvotes" integer DEFAULT 0;
ALTER TABLE "comments" ADD COLUMN "downvotes" integer DEFAULT 0;
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_comments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "comment_votes" ADD CONSTRAINT "comment_votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "comment_votes" ADD CONSTRAINT "comment_votes_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
