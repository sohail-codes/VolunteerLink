-- AlterTable
ALTER TABLE `User` ADD COLUMN `role` ENUM('user', 'ngo') NOT NULL DEFAULT 'user';
