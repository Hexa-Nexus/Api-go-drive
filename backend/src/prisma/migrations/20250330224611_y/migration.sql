/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Gestor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ano` to the `Carro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cor` to the `Carro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marca` to the `Carro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpf` to the `Gestor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Carro` ADD COLUMN `ano` INTEGER NOT NULL,
    ADD COLUMN `cor` VARCHAR(191) NOT NULL,
    ADD COLUMN `marca` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Gestor` ADD COLUMN `cpf` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Gestor_cpf_key` ON `Gestor`(`cpf`);
