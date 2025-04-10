/*
  Warnings:

  - A unique constraint covering the columns `[placa]` on the table `Carro` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Carro` ALTER COLUMN `placa` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `Carro_placa_key` ON `Carro`(`placa`);
