-- AlterTable
ALTER TABLE "HomePageContent" ALTER COLUMN "id" SET DEFAULT 'HOME_PAGE';

-- CreateIndex
CREATE INDEX "HomePageContent_id_idx" ON "HomePageContent"("id");
