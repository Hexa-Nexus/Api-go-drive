/*
  Warnings:

  - Added the required column `ano` to the `Carro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marca` to the `Carro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modelo` to the `Carro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `carro` ADD COLUMN `ano` INTEGER NOT NULL,
    ADD COLUMN `marca` VARCHAR(191) NOT NULL,
    ADD COLUMN `modelo` VARCHAR(191) NOT NULL;
