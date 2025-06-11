/*
  Warnings:

  - The primary key for the `carro` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `evento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `gestor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `nome` on the `gestor` table. All the data in the column will be lost.
  - You are about to drop the column `senha` on the `gestor` table. All the data in the column will be lost.
  - The primary key for the `motorista` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `pagamento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `relatorio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `name` to the `Gestor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Gestor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_carrorelatorios` DROP FOREIGN KEY `_CarroRelatorios_A_fkey`;

-- DropForeignKey
ALTER TABLE `_carrorelatorios` DROP FOREIGN KEY `_CarroRelatorios_B_fkey`;

-- DropForeignKey
ALTER TABLE `carro` DROP FOREIGN KEY `Carro_gestorId_fkey`;

-- DropForeignKey
ALTER TABLE `evento` DROP FOREIGN KEY `Evento_carroId_fkey`;

-- DropForeignKey
ALTER TABLE `evento` DROP FOREIGN KEY `Evento_gestorId_fkey`;

-- DropForeignKey
ALTER TABLE `evento` DROP FOREIGN KEY `Evento_motoristaId_fkey`;

-- DropForeignKey
ALTER TABLE `evento` DROP FOREIGN KEY `Evento_relatorioId_fkey`;

-- DropForeignKey
ALTER TABLE `motorista` DROP FOREIGN KEY `Motorista_gestorId_fkey`;

-- DropForeignKey
ALTER TABLE `pagamento` DROP FOREIGN KEY `Pagamento_eventoId_fkey`;

-- DropForeignKey
ALTER TABLE `pagamento` DROP FOREIGN KEY `Pagamento_gestorId_fkey`;

-- DropForeignKey
ALTER TABLE `pagamento` DROP FOREIGN KEY `Pagamento_relatorioId_fkey`;

-- DropForeignKey
ALTER TABLE `relatorio` DROP FOREIGN KEY `Relatorio_gestorId_fkey`;

-- DropIndex
DROP INDEX `Carro_gestorId_fkey` ON `carro`;

-- DropIndex
DROP INDEX `Evento_carroId_fkey` ON `evento`;

-- DropIndex
DROP INDEX `Evento_gestorId_fkey` ON `evento`;

-- DropIndex
DROP INDEX `Evento_motoristaId_fkey` ON `evento`;

-- DropIndex
DROP INDEX `Evento_relatorioId_fkey` ON `evento`;

-- DropIndex
DROP INDEX `Motorista_gestorId_fkey` ON `motorista`;

-- DropIndex
DROP INDEX `Pagamento_eventoId_fkey` ON `pagamento`;

-- DropIndex
DROP INDEX `Pagamento_gestorId_fkey` ON `pagamento`;

-- DropIndex
DROP INDEX `Pagamento_relatorioId_fkey` ON `pagamento`;

-- DropIndex
DROP INDEX `Relatorio_gestorId_fkey` ON `relatorio`;

-- AlterTable
ALTER TABLE `_carrorelatorios` MODIFY `A` VARCHAR(191) NOT NULL,
    MODIFY `B` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `carro` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `gestorId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `evento` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `carroId` VARCHAR(191) NOT NULL,
    MODIFY `gestorId` VARCHAR(191) NOT NULL,
    MODIFY `motoristaId` VARCHAR(191) NOT NULL,
    MODIFY `relatorioId` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `gestor` DROP PRIMARY KEY,
    DROP COLUMN `nome`,
    DROP COLUMN `senha`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `motorista` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `gestorId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `pagamento` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `gestorId` VARCHAR(191) NOT NULL,
    MODIFY `eventoId` VARCHAR(191) NOT NULL,
    MODIFY `relatorioId` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `relatorio` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `gestorId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Motorista` ADD CONSTRAINT `Motorista_gestorId_fkey` FOREIGN KEY (`gestorId`) REFERENCES `Gestor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Carro` ADD CONSTRAINT `Carro_gestorId_fkey` FOREIGN KEY (`gestorId`) REFERENCES `Gestor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evento` ADD CONSTRAINT `Evento_carroId_fkey` FOREIGN KEY (`carroId`) REFERENCES `Carro`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evento` ADD CONSTRAINT `Evento_gestorId_fkey` FOREIGN KEY (`gestorId`) REFERENCES `Gestor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evento` ADD CONSTRAINT `Evento_motoristaId_fkey` FOREIGN KEY (`motoristaId`) REFERENCES `Motorista`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evento` ADD CONSTRAINT `Evento_relatorioId_fkey` FOREIGN KEY (`relatorioId`) REFERENCES `Relatorio`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Relatorio` ADD CONSTRAINT `Relatorio_gestorId_fkey` FOREIGN KEY (`gestorId`) REFERENCES `Gestor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pagamento` ADD CONSTRAINT `Pagamento_gestorId_fkey` FOREIGN KEY (`gestorId`) REFERENCES `Gestor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pagamento` ADD CONSTRAINT `Pagamento_eventoId_fkey` FOREIGN KEY (`eventoId`) REFERENCES `Evento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pagamento` ADD CONSTRAINT `Pagamento_relatorioId_fkey` FOREIGN KEY (`relatorioId`) REFERENCES `Relatorio`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CarroRelatorios` ADD CONSTRAINT `_CarroRelatorios_A_fkey` FOREIGN KEY (`A`) REFERENCES `Carro`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CarroRelatorios` ADD CONSTRAINT `_CarroRelatorios_B_fkey` FOREIGN KEY (`B`) REFERENCES `Relatorio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
