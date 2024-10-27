/*
  Warnings:

  - The primary key for the `Bike` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bikeid` on the `Bike` table. All the data in the column will be lost.
  - You are about to drop the column `featured` on the `Bike` table. All the data in the column will be lost.
  - You are about to drop the column `promoted` on the `Bike` table. All the data in the column will be lost.
  - You are about to alter the column `contactNo` on the `Bike` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to alter the column `brand` on the `Bike` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `model` on the `Bike` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `engine` on the `Bike` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the column `userphoneNo` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `userEmail` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `userCity` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - The primary key for the `Vehicle` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `featured` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `options` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `promoted` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleid` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to alter the column `contactNo` on the `Vehicle` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to alter the column `brand` on the `Vehicle` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `model` on the `Vehicle` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `engine` on the `Vehicle` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - A unique constraint covering the columns `[userEmail]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `image1` to the `Bike` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image2` to the `Bike` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image3` to the `Bike` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image4` to the `Bike` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image5` to the `Bike` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `startType` on the `Bike` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `bikeType` on the `Bike` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userDistrict` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userPhone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image1` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image2` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image3` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image4` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image5` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `gear` on the `Vehicle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `fuelType` on the `Vehicle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "GearType" AS ENUM ('AUTOMATIC', 'MANUAL', 'SEMI_AUTOMATIC');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID');

-- CreateEnum
CREATE TYPE "StartType" AS ENUM ('ELECTRIC', 'KICK');

-- CreateEnum
CREATE TYPE "BikeType" AS ENUM ('FUEL', 'ELECTRIC');

-- AlterTable
ALTER TABLE "Bike" DROP CONSTRAINT "Bike_pkey",
DROP COLUMN "bikeid",
DROP COLUMN "featured",
DROP COLUMN "promoted",
ADD COLUMN     "bikeId" SERIAL NOT NULL,
ADD COLUMN     "image1" VARCHAR(255) NOT NULL,
ADD COLUMN     "image2" VARCHAR(255) NOT NULL,
ADD COLUMN     "image3" VARCHAR(255) NOT NULL,
ADD COLUMN     "image4" VARCHAR(255) NOT NULL,
ADD COLUMN     "image5" VARCHAR(255) NOT NULL,
ALTER COLUMN "contactNo" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "brand" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "model" SET DATA TYPE VARCHAR(50),
DROP COLUMN "startType",
ADD COLUMN     "startType" "StartType" NOT NULL,
DROP COLUMN "bikeType",
ADD COLUMN     "bikeType" "BikeType" NOT NULL,
ALTER COLUMN "engine" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "details" DROP NOT NULL,
ADD CONSTRAINT "Bike_pkey" PRIMARY KEY ("bikeId");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userphoneNo",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "userDistrict" VARCHAR(50) NOT NULL,
ADD COLUMN     "userPhone" VARCHAR(15) NOT NULL,
ALTER COLUMN "username" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "userEmail" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "userCity" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_pkey",
DROP COLUMN "featured",
DROP COLUMN "options",
DROP COLUMN "promoted",
DROP COLUMN "vehicleid",
ADD COLUMN     "image1" VARCHAR(255) NOT NULL,
ADD COLUMN     "image2" VARCHAR(255) NOT NULL,
ADD COLUMN     "image3" VARCHAR(255) NOT NULL,
ADD COLUMN     "image4" VARCHAR(255) NOT NULL,
ADD COLUMN     "image5" VARCHAR(255) NOT NULL,
ADD COLUMN     "vehicleId" SERIAL NOT NULL,
ALTER COLUMN "contactNo" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "brand" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "model" SET DATA TYPE VARCHAR(50),
DROP COLUMN "gear",
ADD COLUMN     "gear" "GearType" NOT NULL,
DROP COLUMN "fuelType",
ADD COLUMN     "fuelType" "FuelType" NOT NULL,
ALTER COLUMN "engine" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "details" DROP NOT NULL,
ADD CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("vehicleId");

-- CreateTable
CREATE TABLE "PromotedItem" (
    "id" SERIAL NOT NULL,
    "vehicleId" INTEGER,
    "bikeId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromotedItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturedItem" (
    "id" SERIAL NOT NULL,
    "vehicleId" INTEGER,
    "bikeId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeaturedItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PromotedItem_createdAt_idx" ON "PromotedItem"("createdAt");

-- CreateIndex
CREATE INDEX "FeaturedItem_createdAt_idx" ON "FeaturedItem"("createdAt");

-- CreateIndex
CREATE INDEX "Bike_postedAt_idx" ON "Bike"("postedAt");

-- CreateIndex
CREATE INDEX "Bike_price_idx" ON "Bike"("price");

-- CreateIndex
CREATE UNIQUE INDEX "User_userEmail_key" ON "User"("userEmail");

-- CreateIndex
CREATE INDEX "Vehicle_postedAt_idx" ON "Vehicle"("postedAt");

-- CreateIndex
CREATE INDEX "Vehicle_price_idx" ON "Vehicle"("price");

-- AddForeignKey
ALTER TABLE "PromotedItem" ADD CONSTRAINT "PromotedItem_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("vehicleId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotedItem" ADD CONSTRAINT "PromotedItem_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "Bike"("bikeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedItem" ADD CONSTRAINT "FeaturedItem_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("vehicleId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedItem" ADD CONSTRAINT "FeaturedItem_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "Bike"("bikeId") ON DELETE SET NULL ON UPDATE CASCADE;
