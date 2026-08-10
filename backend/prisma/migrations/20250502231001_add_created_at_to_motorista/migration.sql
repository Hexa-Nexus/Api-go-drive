/*
  Warnings:

  - You are about to drop the column `data` on the `evento` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `evento` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `evento` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `gestor` table. All the data in the column will be lost.
  - You are about to drop the column `senha` on the `gestor` table. All the data in the column will be lost.
  - You are about to drop the `_eventotomotorista` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `gestorId` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motoristaId` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `odometroInicial` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoEvento` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Gestor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Gestor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Gestor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Motorista` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_eventotomotorista` DROP FOREIGN KEY `_EventoToMotorista_A_fkey`;

-- DropForeignKey
ALTER TABLE `_eventotomotorista` DROP FOREIGN KEY `_EventoToMotorista_B_fkey`;

-- AlterTable
ALTER TABLE `carro` MODIFY `disponivel` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `evento` DROP COLUMN `data`,
    DROP COLUMN `descricao`,
    DROP COLUMN `nome`,
    ADD COLUMN `dataEntrada` DATETIME(3) NULL,
    ADD COLUMN `dataSaida` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `gestorId` INTEGER NOT NULL,
    ADD COLUMN `motoristaId` INTEGER NOT NULL,
    ADD COLUMN `odometroFinal` INTEGER NULL,
    ADD COLUMN `odometroInicial` INTEGER NOT NULL,
    ADD COLUMN `relatorioId` INTEGER NULL,
    ADD COLUMN `status` ENUM('PENDENTE', 'CONCLUIDO', 'CANCELADO') NOT NULL,
    ADD COLUMN `tipoEvento` ENUM('SAIDA', 'ENTRADA') NOT NULL;

-- AlterTable
ALTER TABLE `gestor` DROP COLUMN `nome`,
    DROP COLUMN `senha`,
    ADD COLUMN `admin` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `motorista` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `telefone` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_eventotomotorista`;

-- CreateTable
CREATE TABLE `Relatorio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tipo` ENUM('FINANCEIRO') NOT NULL,
    `gestorId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pagamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `valor` DOUBLE NOT NULL,
    `data` DATETIME(3) NOT NULL,
    `metodoPagamento` ENUM('Pagamento_Indefinido', 'CARTAO', 'PIX', 'DINHEIRO', 'BOLETO') NOT NULL DEFAULT 'Pagamento_Indefinido',
    `statusPagamento` ENUM('PENDENTE', 'PAGO', 'CANCELADO') NOT NULL DEFAULT 'PENDENTE',
    `gestorId` INTEGER NOT NULL,
    `eventoId` INTEGER NOT NULL,
    `relatorioId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CarroRelatorios` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CarroRelatorios_AB_unique`(`A`, `B`),
    INDEX `_CarroRelatorios_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
