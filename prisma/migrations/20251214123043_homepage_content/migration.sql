/*
  Warnings:

  - The primary key for the `HomePageContent` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "HomePageContent" DROP CONSTRAINT "HomePageContent_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "HomePageContent_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "HomePageContent_id_seq";
