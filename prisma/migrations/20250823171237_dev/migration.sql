/*
  Warnings:

  - Added the required column `address` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryType` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emirate` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('STRIPE', 'COD');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."DeliveryType" AS ENUM ('STANDARD', 'EXPRESS', 'SCHEDULED');

-- DropIndex
DROP INDEX "public"."Order_status_idx";

-- DropIndex
DROP INDEX "public"."Order_userId_idx";

-- DropIndex
DROP INDEX "public"."OrderItem_orderId_idx";

-- DropIndex
DROP INDEX "public"."OrderItem_productId_idx";

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "cardLast4" TEXT,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "deliveryDate" TIMESTAMP(3),
ADD COLUMN     "deliveryTime" TEXT,
ADD COLUMN     "deliveryType" "public"."DeliveryType" NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "emirate" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "paymentMethod" "public"."PaymentMethod" NOT NULL,
ADD COLUMN     "paymentStatus" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "specialInstructions" TEXT,
ADD COLUMN     "stripePaymentId" TEXT;
