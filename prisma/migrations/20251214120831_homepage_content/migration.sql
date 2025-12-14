-- CreateTable
CREATE TABLE "HomePageContent" (
    "id" SERIAL NOT NULL,
    "categoryTitle" TEXT NOT NULL,
    "categoryDesc" TEXT NOT NULL,
    "featureTitle" TEXT NOT NULL,
    "featureSubtitle" TEXT NOT NULL,
    "featureDesc" TEXT NOT NULL,
    "seasonTitle" TEXT NOT NULL,
    "seasonSubtitle" TEXT NOT NULL,
    "seasonDesc" TEXT NOT NULL,
    "excellenceTitle" TEXT NOT NULL,
    "excellenceSubtitle" TEXT NOT NULL,
    "testimonialTitle" TEXT NOT NULL,
    "testimonialDesc" TEXT NOT NULL,
    "newsletterTitle" TEXT NOT NULL,
    "newsletterDesc" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomePageContent_pkey" PRIMARY KEY ("id")
);
