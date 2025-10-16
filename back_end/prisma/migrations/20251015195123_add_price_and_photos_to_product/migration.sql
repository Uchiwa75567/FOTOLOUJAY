-- CreateTable
CREATE TABLE `ProductPhoto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `isMain` BOOLEAN NOT NULL DEFAULT false,
    `order` INTEGER NOT NULL DEFAULT 0,
    `productId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `photoUrl`,
    ADD COLUMN `price` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `ProductPhoto` ADD CONSTRAINT `ProductPhoto_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing photoUrl to ProductPhoto
INSERT INTO `ProductPhoto` (`url`, `isMain`, `order`, `productId`, `createdAt`)
SELECT `photoUrl`, TRUE, 0, `id`, NOW()
FROM `Product`
WHERE `photoUrl` IS NOT NULL AND `photoUrl` != '';
