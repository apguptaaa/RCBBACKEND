ALTER TABLE "categories" ADD COLUMN "deleted_at" TIMESTAMPTZ(6);
ALTER TABLE "subcategories" ADD COLUMN "deleted_at" TIMESTAMPTZ(6);
ALTER TABLE "products" ADD COLUMN "deleted_at" TIMESTAMPTZ(6);
ALTER TABLE "addons" ADD COLUMN "deleted_at" TIMESTAMPTZ(6);
ALTER TABLE "banners" ADD COLUMN "deleted_at" TIMESTAMPTZ(6);
ALTER TABLE "reviews" ADD COLUMN "deleted_at" TIMESTAMPTZ(6);
