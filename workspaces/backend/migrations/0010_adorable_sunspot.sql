ALTER TABLE "councils" ADD COLUMN "enableUpdate" boolean DEFAULT false;
ALTER TABLE "councils" ADD COLUMN "enableComments" boolean DEFAULT false;
ALTER TABLE "councils" ADD COLUMN "slug" text NOT NULL;