-- CreateTable
CREATE TABLE `Motorista` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `habilitacao` VARCHAR(191) NOT NULL,
    `disponivel` BOOLEAN NOT NULL DEFAULT true,
    `gestorId` INTEGER NOT NULL,

    UNIQUE INDEX `Motorista_cpf_key`(`cpf`),
    UNIQUE INDEX `Motorista_habilitacao_key`(`habilitacao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_EventoToMotorista` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_EventoToMotorista_AB_unique`(`A`, `B`),
    INDEX `_EventoToMotorista_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Motorista` ADD CONSTRAINT `Motorista_gestorId_fkey` FOREIGN KEY (`gestorId`) REFERENCES `Gestor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EventoToMotorista` ADD CONSTRAINT `_EventoToMotorista_A_fkey` FOREIGN KEY (`A`) REFERENCES `Evento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EventoToMotorista` ADD CONSTRAINT `_EventoToMotorista_B_fkey` FOREIGN KEY (`B`) REFERENCES `Motorista`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
