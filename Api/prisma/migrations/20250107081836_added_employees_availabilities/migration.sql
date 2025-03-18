/*
  Warnings:

  - The values [MORNING,AFTERNOON] on the enum `WorkDay_ServiceType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Employee` ADD COLUMN `FridayEvening` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `FridayNoon` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `MoondayEvening` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `MoondayNoon` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `SaturdayEvening` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `SaturdayNoon` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `SundayEvening` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `SundayNoon` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ThursdayEvening` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ThursdayNoon` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `TuesdayEvening` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `TuesdayNoon` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `WednesdayEvening` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `WednesdayNoon` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `WorkDay` MODIFY `ServiceType` ENUM('NOON', 'EVENING') NOT NULL;
