/*
  Warnings:

  - Added the required column `updatedAt` to the `Carro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descricao` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Evento` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Carro_placa_key` ON `carro`;

-- AlterTable
ALTER TABLE `carro` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;


-- AlterTable
ALTER TABLE `evento` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `descricao` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
