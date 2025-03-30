/*
  Warnings:

  - You are about to drop the column `motoristaId` on the `Carro` table. All the data in the column will be lost.
  - You are about to drop the column `dataHora` on the `Evento` table. All the data in the column will be lost.
  - You are about to drop the column `statusPagamento` on the `Evento` table. All the data in the column will be lost.
  - You are about to drop the column `valor` on the `Evento` table. All the data in the column will be lost.
  - You are about to alter the column `tipoEvento` on the `Evento` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to drop the column `status` on the `Pagamento` table. All the data in the column will be lost.
  - You are about to alter the column `metodoPagamento` on the `Pagamento` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - Added the required column `dataEntrada` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataSaida` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventoId` to the `Pagamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusPagamento` to the `Pagamento` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Carro` DROP FOREIGN KEY `Carro_motoristaId_fkey`;

-- DropIndex
DROP INDEX `Carro_motoristaId_fkey` ON `Carro`;

-- AlterTable
ALTER TABLE `Carro` DROP COLUMN `motoristaId`;

-- AlterTable
ALTER TABLE `Evento` DROP COLUMN `dataHora`,
    DROP COLUMN `statusPagamento`,
    DROP COLUMN `valor`,
    ADD COLUMN `dataEntrada` DATETIME(3) NOT NULL,
    ADD COLUMN `dataSaida` DATETIME(3) NOT NULL,
    ADD COLUMN `motoristaId` VARCHAR(191) NULL,
    ADD COLUMN `relatorioId` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('PENDENTE', 'CONCLUIDO', 'CANCELADO') NOT NULL,
    MODIFY `tipoEvento` ENUM('SAIDA', 'ENTRADA') NOT NULL;

-- AlterTable
ALTER TABLE `Pagamento` DROP COLUMN `status`,
    ADD COLUMN `eventoId` VARCHAR(191) NOT NULL,
    ADD COLUMN `relatorioId` VARCHAR(191) NULL,
    ADD COLUMN `statusPagamento` ENUM('PENDENTE', 'PAGO', 'CANCELADO') NOT NULL,
    MODIFY `metodoPagamento` ENUM('CARTAO', 'PIX', 'DINHEIRO', 'BOLETO') NOT NULL;

-- AddForeignKey
ALTER TABLE `Evento` ADD CONSTRAINT `Evento_motoristaId_fkey` FOREIGN KEY (`motoristaId`) REFERENCES `Motorista`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evento` ADD CONSTRAINT `Evento_relatorioId_fkey` FOREIGN KEY (`relatorioId`) REFERENCES `Relatorio`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pagamento` ADD CONSTRAINT `Pagamento_eventoId_fkey` FOREIGN KEY (`eventoId`) REFERENCES `Evento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pagamento` ADD CONSTRAINT `Pagamento_relatorioId_fkey` FOREIGN KEY (`relatorioId`) REFERENCES `Relatorio`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
