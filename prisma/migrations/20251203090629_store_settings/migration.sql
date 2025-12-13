-- AlterTable
ALTER TABLE "StoreSettings" ADD COLUMN     "codFee" DECIMAL(10,2) NOT NULL DEFAULT 10.00,
ADD COLUMN     "expressDeliveryFee" DECIMAL(10,2) NOT NULL DEFAULT 30.00,
ADD COLUMN     "isExpressEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isScheduledEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scheduledDeliveryFee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ALTER COLUMN "deliveryEmirates" DROP NOT NULL;
