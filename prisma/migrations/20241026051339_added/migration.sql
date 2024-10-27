/*
  Warnings:

  - The values [VEHICLE] on the enum `AdType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AdType_new" AS ENUM ('CAR', 'VAN', 'JEEP', 'LORRY', 'BIKE', 'CREWCAB', 'PICKUP', 'BUS', 'TRUCK', 'THREEWHEEL', 'TRACTOR', 'HEAVYDUTY', 'OTHER');
ALTER TABLE "Ad" ALTER COLUMN "vehicleType" TYPE "AdType_new" USING ("vehicleType"::text::"AdType_new");
ALTER TYPE "AdType" RENAME TO "AdType_old";
ALTER TYPE "AdType_new" RENAME TO "AdType";
DROP TYPE "AdType_old";
COMMIT;
