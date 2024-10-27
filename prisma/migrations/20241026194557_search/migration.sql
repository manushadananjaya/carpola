-- DropIndex
DROP INDEX "Ad_postedAt_idx";

-- DropIndex
DROP INDEX "Ad_price_idx";

-- AlterTable
ALTER TABLE "Ad" ALTER COLUMN "posted" SET DEFAULT false,
ALTER COLUMN "postedAt" DROP NOT NULL,
ALTER COLUMN "postedAt" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Ad_posted_postedAt_price_idx" ON "Ad"("posted", "postedAt", "price");
