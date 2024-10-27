/*
  Warnings:

  - You are about to drop the `FeaturedItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `promotionExpiresAt` to the `PromotedItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FeaturedItem" DROP CONSTRAINT "FeaturedItem_adId_fkey";

-- AlterTable
ALTER TABLE "PromotedItem" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "promotionExpiresAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "FeaturedItem";
