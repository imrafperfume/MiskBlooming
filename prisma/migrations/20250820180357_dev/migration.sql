/*
  Warnings:

  - Changed the type of `optimizedUrls` on the `CloudinaryImage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."CloudinaryImage" DROP COLUMN "optimizedUrls",
ADD COLUMN     "optimizedUrls" JSONB NOT NULL;
