-- AlterTable
ALTER TABLE `Event` ADD COLUMN `legacyId` VARCHAR(191) NULL,
    ADD COLUMN `sourceId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Source` (
    `id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_sourceId_fkey` FOREIGN KEY (`sourceId`) REFERENCES `Source`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
