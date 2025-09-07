-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE 'GUEST';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "isGuest" BOOLEAN NOT NULL DEFAULT false;
