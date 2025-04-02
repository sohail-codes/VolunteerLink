/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `EventParticipation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `EventParticipation` MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT;

-- CreateIndex
CREATE UNIQUE INDEX `EventParticipation_id_key` ON `EventParticipation`(`id`);
