/*
  Warnings:

  - The primary key for the `Vehicle` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Vehicle` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `featured` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Made the column `engine` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `details` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_pkey",
DROP COLUMN "id",
ADD COLUMN     "featured" BOOLEAN NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD COLUMN     "vehicleid" SERIAL NOT NULL,
ALTER COLUMN "price" SET DATA TYPE INTEGER,
ALTER COLUMN "options" SET NOT NULL,
ALTER COLUMN "options" SET DATA TYPE TEXT,
ALTER COLUMN "engine" SET NOT NULL,
ALTER COLUMN "details" SET NOT NULL,
ALTER COLUMN "posted" DROP DEFAULT,
ALTER COLUMN "promoted" DROP DEFAULT,
ADD CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("vehicleid");

-- CreateTable
CREATE TABLE "Bike" (
    "bikeid" SERIAL NOT NULL,
    "contactNo" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "startType" TEXT NOT NULL,
    "bikeType" TEXT NOT NULL,
    "engine" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "posted" BOOLEAN NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "promoted" BOOLEAN NOT NULL,
    "featured" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Bike_pkey" PRIMARY KEY ("bikeid")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userphoneNo" TEXT NOT NULL,
    "userCity" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bike" ADD CONSTRAINT "Bike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
