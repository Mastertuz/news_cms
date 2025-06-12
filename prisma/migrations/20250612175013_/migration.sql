/*
  Warnings:

  - Made the column `imageUrl` on table `News` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sourceUrl` on table `News` required. This step will fail if there are existing NULL values in that column.
  - Made the column `source` on table `News` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "News" ALTER COLUMN "imageUrl" SET NOT NULL,
ALTER COLUMN "sourceUrl" SET NOT NULL,
ALTER COLUMN "source" SET NOT NULL;

-- CreateIndex
CREATE INDEX "News_category_idx" ON "News"("category");

-- CreateIndex
CREATE INDEX "News_author_idx" ON "News"("author");

-- CreateIndex
CREATE INDEX "News_createdAt_idx" ON "News"("createdAt");
