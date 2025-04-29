-- DropForeignKey
ALTER TABLE `Address` DROP FOREIGN KEY `Address_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Event` DROP FOREIGN KEY `Event_organizerId_fkey`;

-- DropForeignKey
ALTER TABLE `EventParticipation` DROP FOREIGN KEY `EventParticipation_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `EventParticipation` DROP FOREIGN KEY `EventParticipation_userId_fkey`;

-- DropIndex
DROP INDEX `Event_organizerId_fkey` ON `Event`;

-- DropIndex
DROP INDEX `EventParticipation_eventId_fkey` ON `EventParticipation`;

-- DropIndex
DROP INDEX `EventParticipation_userId_fkey` ON `EventParticipation`;

-- AddForeignKey
ALTER TABLE `EventParticipation` ADD CONSTRAINT `EventParticipation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventParticipation` ADD CONSTRAINT `EventParticipation_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_organizerId_fkey` FOREIGN KEY (`organizerId`) REFERENCES `Organizer`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
