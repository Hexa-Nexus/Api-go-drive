/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Motorista` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[habilitacao]` on the table `Motorista` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Motorista` ALTER COLUMN `cpf` DROP DEFAULT,
    ALTER COLUMN `habilitacao` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `Motorista_cpf_key` ON `Motorista`(`cpf`);

-- CreateIndex
CREATE UNIQUE INDEX `Motorista_habilitacao_key` ON `Motorista`(`habilitacao`);
