/*
  Warnings:

  - You are about to drop the column `restaurantId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the `Restaurant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RestaurantPermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RestaurantRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRestaurant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RestaurantPermissionToRestaurantRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Employee` DROP FOREIGN KEY `Employee_restaurantId_fkey`;

-- DropForeignKey
ALTER TABLE `UserRestaurant` DROP FOREIGN KEY `UserRestaurant_restaurantId_fkey`;

-- DropForeignKey
ALTER TABLE `UserRestaurant` DROP FOREIGN KEY `UserRestaurant_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `UserRestaurant` DROP FOREIGN KEY `UserRestaurant_userId_fkey`;

-- DropForeignKey
ALTER TABLE `_RestaurantPermissionToRestaurantRole` DROP FOREIGN KEY `_RestaurantPermissionToRestaurantRole_A_fkey`;

-- DropForeignKey
ALTER TABLE `_RestaurantPermissionToRestaurantRole` DROP FOREIGN KEY `_RestaurantPermissionToRestaurantRole_B_fkey`;

-- AlterTable
ALTER TABLE `Employee` DROP COLUMN `restaurantId`,
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `phone` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Restaurant`;

-- DropTable
DROP TABLE `RestaurantPermission`;

-- DropTable
DROP TABLE `RestaurantRole`;

-- DropTable
DROP TABLE `UserRestaurant`;

-- DropTable
DROP TABLE `_RestaurantPermissionToRestaurantRole`;
