-- DropForeignKey
ALTER TABLE `OTP` DROP FOREIGN KEY `OTP_userId_fkey`;

-- DropIndex
DROP INDEX `OTP_userId_fkey` ON `OTP`;

-- AddForeignKey
ALTER TABLE `OTP` ADD CONSTRAINT `OTP_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
