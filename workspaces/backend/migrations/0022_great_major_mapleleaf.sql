ALTER TABLE "pages" ADD COLUMN "slug" text;
ALTER TABLE "pages" ADD CONSTRAINT "pages_slug_unique" UNIQUE("slug");