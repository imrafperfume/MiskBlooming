/*
  Warnings:

  - You are about to drop the `System` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DeliveryMethod" AS ENUM ('flat', 'emirate');

-- DropTable
DROP TABLE "System";

-- CreateTable
CREATE TABLE "StoreSettings" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "storeName" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "supportEmail" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'AED',
    "timezone" TEXT NOT NULL DEFAULT 'GST',
    "address" TEXT NOT NULL,
    "vatRate" DECIMAL(5,2) NOT NULL DEFAULT 5.00,
    "deliveryMethod" "DeliveryMethod" NOT NULL DEFAULT 'flat',
    "deliveryFlatRate" DECIMAL(10,2) NOT NULL DEFAULT 15.00,
    "freeShippingThreshold" DECIMAL(10,2),
    "deliveryEmirates" JSONB NOT NULL,

    CONSTRAINT "StoreSettings_pkey" PRIMARY KEY ("id")
);
