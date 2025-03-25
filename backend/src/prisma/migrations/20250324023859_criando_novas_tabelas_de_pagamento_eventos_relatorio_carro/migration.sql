/*
  Warnings:

  - Made the column `name` on table `Gestor` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `gestorId` to the `Motorista` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Motorista` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Gestor` MODIFY `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Motorista` ADD COLUMN `gestorId` VARCHAR(191) NOT NULL,
    MODIFY `name` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Carro` (
    `id` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(191) NOT NULL,
    `placa` VARCHAR(191) NOT NULL,
    `odometroAtual` INTEGER NOT NULL,
    `disponivel` BOOLEAN NOT NULL DEFAULT true,
    `gestorId` VARCHAR(191) NOT NULL,
    `motoristaId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Carro_placa_key`(`placa`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Evento` (
    `id` VARCHAR(191) NOT NULL,
    `tipoEvento` VARCHAR(191) NOT NULL,
    `dataHora` DATETIME(3) NOT NULL,
    `odometro` INTEGER NOT NULL,
    `valor` DOUBLE NOT NULL,
    `statusPagamento` VARCHAR(191) NOT NULL,
    `carroId` VARCHAR(191) NOT NULL,
    `gestorId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Relatorio` (
    `id` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `dataInicio` DATETIME(3) NOT NULL,
    `dataFim` DATETIME(3) NOT NULL,
    `gestorId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pagamento` (
    `id` VARCHAR(191) NOT NULL,
    `valor` DOUBLE NOT NULL,
    `data` DATETIME(3) NOT NULL,
    `metodoPagamento` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `gestorId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Motorista` ADD CONSTRAINT `Motorista_gestorId_fkey` FOREIGN KEY (`gestorId`) REFERENCES `Gestor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Carro` ADD CONSTRAINT `Carro_gestorId_fkey` FOREIGN KEY (`gestorId`) REFERENCES `Gestor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Carro` ADD CONSTRAINT `Carro_motoristaId_fkey` FOREIGN KEY (`motoristaId`) REFERENCES `Motorista`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evento` ADD CONSTRAINT `Evento_carroId_fkey` FOREIGN KEY (`carroId`) REFERENCES `Carro`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evento` ADD CONSTRAINT `Evento_gestorId_fkey` FOREIGN KEY (`gestorId`) REFERENCES `Gestor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Relatorio` ADD CONSTRAINT `Relatorio_gestorId_fkey` FOREIGN KEY (`gestorId`) REFERENCES `Gestor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pagamento` ADD CONSTRAINT `Pagamento_gestorId_fkey` FOREIGN KEY (`gestorId`) REFERENCES `Gestor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
