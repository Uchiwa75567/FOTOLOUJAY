-- AlterTable
ALTER TABLE `Product` ADD COLUMN `rejectionReason` VARCHAR(191) NULL,
    MODIFY `description` VARCHAR(191) NULL;
