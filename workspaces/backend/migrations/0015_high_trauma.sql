ALTER TABLE "comments" DROP CONSTRAINT "comments_user_id_users_id_fk";

ALTER TABLE "comments" DROP CONSTRAINT "comments_post_id_posts_id_fk";

ALTER TABLE "comments" DROP CONSTRAINT "comments_page_id_pages_id_fk";

ALTER TABLE "comments" DROP CONSTRAINT "comments_snip_id_snips_id_fk";

ALTER TABLE "delegates" DROP CONSTRAINT "delegates_userId_users_id_fk";

ALTER TABLE "posts" DROP CONSTRAINT "posts_councilId_councils_id_fk";

ALTER TABLE "posts" DROP CONSTRAINT "posts_userId_users_id_fk";

ALTER TABLE "snips" DROP CONSTRAINT "snips_userId_users_id_fk";

ALTER TABLE "users_to_councils" DROP CONSTRAINT "users_to_councils_user_id_users_id_fk";

ALTER TABLE "users_to_councils" DROP CONSTRAINT "users_to_councils_council_id_councils_id_fk";

ALTER TABLE "votes" DROP CONSTRAINT "votes_user_id_users_id_fk";

ALTER TABLE "votes" DROP CONSTRAINT "votes_snip_id_snips_id_fk";
