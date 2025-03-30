/*
  Warnings:

  - You are about to alter the column `tipo` on the `Relatorio` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- DropForeignKey
ALTER TABLE `Relatorio` DROP FOREIGN KEY `Relatorio_gestorId_fkey`;

-- DropIndex
DROP INDEX `Relatorio_gestorId_fkey` ON `Relatorio`;

-- AlterTable
ALTER TABLE `Relatorio` MODIFY `tipo` ENUM('FINANCEIRO', 'OPERACIONAL', 'ANALITICO') NOT NULL;

-- AddForeignKey
ALTER TABLE `Relatorio` ADD CONSTRAINT `Relatorio_gestorId_fkey` FOREIGN KEY (`gestorId`) REFERENCES `Gestor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
