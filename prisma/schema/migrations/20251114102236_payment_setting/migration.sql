-- CreateTable
CREATE TABLE "public"."PaymentSetting" (
    "id" TEXT NOT NULL,
    "stripeEnabled" BOOLEAN NOT NULL DEFAULT false,
    "codEnabled" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaymentSetting_id_idx" ON "public"."PaymentSetting"("id");

-- CreateIndex
CREATE INDEX "Product_id_idx" ON "public"."Product"("id");

-- CreateIndex
CREATE INDEX "Product_slug_idx" ON "public"."Product"("slug");
