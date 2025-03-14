/*
  Warnings:

  - Made the column `gender` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `gender` ENUM('male', 'female', 'unspecified') NOT NULL DEFAULT 'unspecified';
