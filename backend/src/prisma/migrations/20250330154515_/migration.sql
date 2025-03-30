/*
  Warnings:

  - The values [OPERACIONAL,ANALITICO] on the enum `Relatorio_tipo` will be removed. If these variants are still used in the database, this will fail.

*/
-- DropIndex
DROP INDEX `Carro_placa_key` ON `Carro`;

-- DropIndex
DROP INDEX `Motorista_cpf_key` ON `Motorista`;

-- DropIndex
DROP INDEX `Motorista_habilitacao_key` ON `Motorista`;

-- AlterTable
ALTER TABLE `Carro` MODIFY `placa` VARCHAR(191) NOT NULL DEFAULT '@unique';

-- AlterTable
ALTER TABLE `Motorista` MODIFY `cpf` VARCHAR(191) NOT NULL DEFAULT '@unique',
    MODIFY `habilitacao` VARCHAR(191) NOT NULL DEFAULT '@unique';

-- AlterTable
ALTER TABLE `Pagamento` MODIFY `metodoPagamento` ENUM('Pagamento_Indefinido', 'CARTAO', 'PIX', 'DINHEIRO', 'BOLETO') NOT NULL DEFAULT 'Pagamento_Indefinido',
    MODIFY `statusPagamento` ENUM('PENDENTE', 'PAGO', 'CANCELADO') NOT NULL DEFAULT 'PENDENTE';

-- AlterTable
ALTER TABLE `Relatorio` MODIFY `tipo` ENUM('FINANCEIRO') NOT NULL,
    MODIFY `dataFim` DATETIME(3) NULL;
