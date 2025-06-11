/*
  Warnings:

  - You are about to drop the column `password` on the `gestor` table. All the data in the column will be lost.
  - Added the required column `senha` to the `Gestor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `gestor` DROP COLUMN `password`,
    ADD COLUMN `senha` VARCHAR(191) NOT NULL;
