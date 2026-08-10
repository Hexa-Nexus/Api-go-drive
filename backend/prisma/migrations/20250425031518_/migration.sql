/*
  Warnings:

  - A unique constraint covering the columns `[placa]` on the table `Carro` will be added. If there are existing duplicate values, this will fail.
  - Made the column `updatedAt` on table `carro` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `carro` MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Carro_placa_key` ON `Carro`(`placa`);
