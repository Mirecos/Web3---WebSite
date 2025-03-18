/*
  Warnings:

  - You are about to drop the column `employeeId` on the `WorkWeek` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[weekNumber]` on the table `WorkWeek` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `employeeId` to the `WorkDay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `WorkWeek` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `WorkWeek` DROP FOREIGN KEY `WorkWeek_employeeId_fkey`;

-- AlterTable
ALTER TABLE `WorkDay` ADD COLUMN `Schedules` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `employeeId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `WorkWeek` DROP COLUMN `employeeId`,
    ADD COLUMN `year` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `WorkWeek_weekNumber_key` ON `WorkWeek`(`weekNumber`);

-- AddForeignKey
ALTER TABLE `WorkDay` ADD CONSTRAINT `WorkDay_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
