/*
  Warnings:

  - You are about to drop the column `data` on the `relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `relatorio` table. All the data in the column will be lost.
  - You are about to alter the column `tipo` on the `relatorio` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.

*/
-- DropForeignKey
ALTER TABLE `relatorio` DROP FOREIGN KEY `Relatorio_gestorId_fkey`;

-- DropIndex
DROP INDEX `Relatorio_gestorId_fkey` ON `relatorio`;

-- AlterTable
ALTER TABLE `relatorio` DROP COLUMN `data`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `filtros` JSON NOT NULL,
    MODIFY `tipo` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Relatorio` ADD CONSTRAINT `Relatorio_gestorId_fkey` FOREIGN KEY (`gestorId`) REFERENCES `Gestor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
