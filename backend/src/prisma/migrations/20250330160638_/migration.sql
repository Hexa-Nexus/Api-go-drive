/*
  Warnings:

  - You are about to drop the column `dataFim` on the `Relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `dataInicio` on the `Relatorio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Relatorio` DROP COLUMN `dataFim`,
    DROP COLUMN `dataInicio`,
    ADD COLUMN `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
