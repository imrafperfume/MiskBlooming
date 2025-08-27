-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('VIP', 'NEW', 'REGULAR');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'NEW',
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
