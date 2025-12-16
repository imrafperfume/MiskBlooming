-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL DEFAULT 'COLLECTION',
    "collectionTitle" TEXT NOT NULL,
    "collectionDesc" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);
