/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Gestor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Gestor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `Gestor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Gestor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `Gestor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `gestor` ADD COLUMN `cpf` VARCHAR(191) NOT NULL,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `senha` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Gestor_cpf_key` ON `Gestor`(`cpf`);

-- CreateIndex
CREATE UNIQUE INDEX `Gestor_email_key` ON `Gestor`(`email`);
