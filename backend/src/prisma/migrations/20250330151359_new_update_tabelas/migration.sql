/*
  Warnings:

  - You are about to drop the column `odometro` on the `Evento` table. All the data in the column will be lost.
  - Added the required column `odometroInicial` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Made the column `cpf` on table `Motorista` required. This step will fail if there are existing NULL values in that column.
  - Made the column `habilitacao` on table `Motorista` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Evento` DROP COLUMN `odometro`,
    ADD COLUMN `odometroFinal` INTEGER NULL,
    ADD COLUMN `odometroInicial` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Motorista` ADD COLUMN `disponivel` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `cpf` VARCHAR(191) NOT NULL,
    MODIFY `habilitacao` VARCHAR(191) NOT NULL;
