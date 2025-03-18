/*
  Warnings:

  - You are about to drop the column `MoondayEvening` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `MoondayNoon` on the `Employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Employee` DROP COLUMN `MoondayEvening`,
    DROP COLUMN `MoondayNoon`,
    ADD COLUMN `MondayEvening` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `MondayNoon` BOOLEAN NOT NULL DEFAULT false;
