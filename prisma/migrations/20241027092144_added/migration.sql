/*
  Warnings:

  - You are about to alter the column `price` on the `Ad` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.

*/
-- DropForeignKey
ALTER TABLE "PromotedItem" DROP CONSTRAINT "PromotedItem_adId_fkey";

-- AlterTable
ALTER TABLE "Ad" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "postedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userPhone" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "Ad_vehicleType_price_idx" ON "Ad"("vehicleType", "price");

-- CreateIndex
CREATE INDEX "Ad_year_idx" ON "Ad"("year");

-- CreateIndex
CREATE INDEX "Ad_brand_model_idx" ON "Ad"("brand", "model");

-- AddForeignKey
ALTER TABLE "PromotedItem" ADD CONSTRAINT "PromotedItem_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad"("adId") ON DELETE CASCADE ON UPDATE CASCADE;
