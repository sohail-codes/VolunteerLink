-- CreateTable
CREATE TABLE `EventParticipation` (
    `id` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `status` ENUM('INREVIEW', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'INREVIEW',
    `eventId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EventParticipation` ADD CONSTRAINT `EventParticipation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventParticipation` ADD CONSTRAINT `EventParticipation_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
