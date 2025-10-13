-- Create PaymentTransaction table
CREATE TABLE `PaymentTransaction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `refCommand` varchar(191) NOT NULL,
  `userId` int NOT NULL,
  `packId` varchar(191) NOT NULL,
  `amount` int NOT NULL,
  `status` enum('PENDING','COMPLETED','FAILED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `token` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `completedAt` datetime(3) NULL,
  UNIQUE KEY `PaymentTransaction_refCommand_key` (`refCommand`),
  UNIQUE KEY `PaymentTransaction_token_key` (`token`),
  PRIMARY KEY (`id`),
  KEY `PaymentTransaction_userId_fkey` (`userId`),
  CONSTRAINT `PaymentTransaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
