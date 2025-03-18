-- CreateTable
CREATE TABLE `WorkWeek` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeId` INTEGER NOT NULL,
    `weekNumber` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkDay` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `workWeekId` INTEGER NOT NULL,
    `Days` ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    `ServiceType` ENUM('MORNING', 'AFTERNOON') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WorkWeek` ADD CONSTRAINT `WorkWeek_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkDay` ADD CONSTRAINT `WorkDay_workWeekId_fkey` FOREIGN KEY (`workWeekId`) REFERENCES `WorkWeek`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
