/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Motorista` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[habilitacao]` on the table `Motorista` will be added. If there are existing duplicate values, this will fail.
  - Made the column `motoristaId` on table `Evento` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Evento` DROP FOREIGN KEY `Evento_motoristaId_fkey`;

-- DropIndex
DROP INDEX `Evento_motoristaId_fkey` ON `Evento`;

-- AlterTable
ALTER TABLE `Evento` MODIFY `motoristaId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Motorista` ADD COLUMN `cpf` VARCHAR(191) NULL,
    ADD COLUMN `habilitacao` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `_CarroRelatorios` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CarroRelatorios_AB_unique`(`A`, `B`),
    INDEX `_CarroRelatorios_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Motorista_cpf_key` ON `Motorista`(`cpf`);

-- CreateIndex
CREATE UNIQUE INDEX `Motorista_habilitacao_key` ON `Motorista`(`habilitacao`);

-- AddForeignKey
ALTER TABLE `Evento` ADD CONSTRAINT `Evento_motoristaId_fkey` FOREIGN KEY (`motoristaId`) REFERENCES `Motorista`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CarroRelatorios` ADD CONSTRAINT `_CarroRelatorios_A_fkey` FOREIGN KEY (`A`) REFERENCES `Carro`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CarroRelatorios` ADD CONSTRAINT `_CarroRelatorios_B_fkey` FOREIGN KEY (`B`) REFERENCES `Relatorio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
