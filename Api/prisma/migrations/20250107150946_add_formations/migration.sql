/*
  Warnings:

  - You are about to drop the column `employeeId` on the `Formation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Formation` DROP FOREIGN KEY `Formation_employeeId_fkey`;

-- AlterTable
ALTER TABLE `Formation` DROP COLUMN `employeeId`;

-- CreateTable
CREATE TABLE `_EmployeeFormations` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_EmployeeFormations_AB_unique`(`A`, `B`),
    INDEX `_EmployeeFormations_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_EmployeeFormations` ADD CONSTRAINT `_EmployeeFormations_A_fkey` FOREIGN KEY (`A`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EmployeeFormations` ADD CONSTRAINT `_EmployeeFormations_B_fkey` FOREIGN KEY (`B`) REFERENCES `Formation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
