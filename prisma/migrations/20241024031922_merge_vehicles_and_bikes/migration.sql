/*
  Warnings:

  - You are about to drop the column `bikeId` on the `FeaturedItem` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleId` on the `FeaturedItem` table. All the data in the column will be lost.
  - You are about to drop the column `bikeId` on the `PromotedItem` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleId` on the `PromotedItem` table. All the data in the column will be lost.
  - You are about to drop the `Bike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicle` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AdType" AS ENUM ('VEHICLE', 'BIKE');

-- DropForeignKey
ALTER TABLE "Bike" DROP CONSTRAINT "Bike_userId_fkey";

-- DropForeignKey
ALTER TABLE "FeaturedItem" DROP CONSTRAINT "FeaturedItem_bikeId_fkey";

-- DropForeignKey
ALTER TABLE "FeaturedItem" DROP CONSTRAINT "FeaturedItem_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "PromotedItem" DROP CONSTRAINT "PromotedItem_bikeId_fkey";

-- DropForeignKey
ALTER TABLE "PromotedItem" DROP CONSTRAINT "PromotedItem_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_userId_fkey";

-- AlterTable
ALTER TABLE "FeaturedItem" DROP COLUMN "bikeId",
DROP COLUMN "vehicleId",
ADD COLUMN     "adId" INTEGER;

-- AlterTable
ALTER TABLE "PromotedItem" DROP COLUMN "bikeId",
DROP COLUMN "vehicleId",
ADD COLUMN     "adId" INTEGER;

-- DropTable
DROP TABLE "Bike";

-- DropTable
DROP TABLE "Vehicle";

-- CreateTable
CREATE TABLE "Ad" (
    "adId" SERIAL NOT NULL,
    "contactNo" VARCHAR(15) NOT NULL,
    "price" INTEGER NOT NULL,
    "brand" VARCHAR(50) NOT NULL,
    "model" VARCHAR(50) NOT NULL,
    "year" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "vehicleType" "AdType" NOT NULL,
    "engine" VARCHAR(100) NOT NULL,
    "details" TEXT,
    "posted" BOOLEAN NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "image1" VARCHAR(255) NOT NULL,
    "image2" VARCHAR(255) NOT NULL,
    "image3" VARCHAR(255) NOT NULL,
    "image4" VARCHAR(255) NOT NULL,
    "image5" VARCHAR(255) NOT NULL,
    "gear" "GearType",
    "fuelType" "FuelType",
    "startType" "StartType",
    "bikeType" "BikeType",

    CONSTRAINT "Ad_pkey" PRIMARY KEY ("adId")
);

-- CreateIndex
CREATE INDEX "Ad_postedAt_idx" ON "Ad"("postedAt");

-- CreateIndex
CREATE INDEX "Ad_price_idx" ON "Ad"("price");

-- AddForeignKey
ALTER TABLE "Ad" ADD CONSTRAINT "Ad_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotedItem" ADD CONSTRAINT "PromotedItem_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad"("adId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedItem" ADD CONSTRAINT "FeaturedItem_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad"("adId") ON DELETE SET NULL ON UPDATE CASCADE;
