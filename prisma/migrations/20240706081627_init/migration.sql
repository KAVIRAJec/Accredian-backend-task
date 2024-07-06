/*
  Warnings:

  - A unique constraint covering the columns `[referral_code]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referral_code` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `balance` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `contact` VARCHAR(191) NULL,
    ADD COLUMN `gender` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `referral_code` VARCHAR(191) NOT NULL,
    ADD COLUMN `referredById` INTEGER NULL,
    ADD COLUMN `total_earning` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `total_referral` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `withdrawn` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX `User_referral_code_key` ON `User`(`referral_code`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_referredById_fkey` FOREIGN KEY (`referredById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
