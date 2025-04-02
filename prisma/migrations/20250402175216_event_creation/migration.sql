/*
  Warnings:

  - You are about to drop the `_EventToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_EventToUser` DROP FOREIGN KEY `_EventToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_EventToUser` DROP FOREIGN KEY `_EventToUser_B_fkey`;

-- AlterTable
ALTER TABLE `Event` ADD COLUMN `creatorId` INTEGER NULL;

-- DropTable
DROP TABLE `_EventToUser`;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
