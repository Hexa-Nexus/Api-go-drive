/*
  Warnings:

  - You are about to drop the column `name` on the `Motorista` table. All the data in the column will be lost.
  - Added the required column `nome` to the `Motorista` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Motorista` DROP COLUMN `name`,
    ADD COLUMN `nome` VARCHAR(191) NOT NULL;
