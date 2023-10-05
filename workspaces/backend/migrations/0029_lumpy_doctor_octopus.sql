ALTER TABLE "posts" ADD COLUMN "slug" text;
ALTER TABLE "posts" ADD CONSTRAINT "posts_slug_unique" UNIQUE("slug");