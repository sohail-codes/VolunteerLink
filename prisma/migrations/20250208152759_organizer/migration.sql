/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Organizer` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `Organizer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Organizer` MODIFY `name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Organizer_name_key` ON `Organizer`(`name`);
