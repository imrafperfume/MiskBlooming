-- CreateTable
CREATE TABLE "AboutPageContent" (
    "id" TEXT NOT NULL DEFAULT 'ABOUT_PAGE',
    "heroTitle" TEXT NOT NULL,
    "heroDesc" TEXT NOT NULL,
    "storyTitle" TEXT NOT NULL,
    "storyDesc1" TEXT NOT NULL,
    "storyDesc2" TEXT NOT NULL,
    "stats" JSONB NOT NULL,
    "values" JSONB NOT NULL,
    "team" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutPageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactPageContent" (
    "id" TEXT NOT NULL DEFAULT 'CONTACT_PAGE',
    "heroTitle" TEXT NOT NULL,
    "heroDesc" TEXT NOT NULL,
    "contactInfo" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactPageContent_pkey" PRIMARY KEY ("id")
);
