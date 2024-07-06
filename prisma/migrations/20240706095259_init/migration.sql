/*
  Warnings:

  - Made the column `referral_code` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `referral_code` VARCHAR(191) NOT NULL;
