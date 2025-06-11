-- CreateTable
CREATE TABLE `Carro` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cor` VARCHAR(191) NOT NULL,
    `placa` VARCHAR(191) NOT NULL,
    `odometroAtual` INTEGER NOT NULL,
    `disponivel` BOOLEAN NOT NULL,
    `gestorId` INTEGER NOT NULL,

    UNIQUE INDEX `Carro_placa_key`(`placa`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Gestor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Carro` ADD CONSTRAINT `Carro_gestorId_fkey` FOREIGN KEY (`gestorId`) REFERENCES `Gestor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
