/*
  Warnings:

  - You are about to drop the column `contactNo` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `image1` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `image2` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `image3` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `image4` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `image5` on the `Ad` table. All the data in the column will be lost.
  - Changed the type of `engine` on the `Ad` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Ad" DROP COLUMN "contactNo",
DROP COLUMN "image1",
DROP COLUMN "image2",
DROP COLUMN "image3",
DROP COLUMN "image4",
DROP COLUMN "image5",
ADD COLUMN     "images" TEXT[],
DROP COLUMN "engine",
ADD COLUMN     "engine" INTEGER NOT NULL;
