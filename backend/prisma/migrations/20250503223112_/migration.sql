-- CreateTable
CREATE TABLE `_MotoristaRelatorios` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_MotoristaRelatorios_AB_unique`(`A`, `B`),
    INDEX `_MotoristaRelatorios_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_MotoristaRelatorios` ADD CONSTRAINT `_MotoristaRelatorios_A_fkey` FOREIGN KEY (`A`) REFERENCES `Motorista`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MotoristaRelatorios` ADD CONSTRAINT `_MotoristaRelatorios_B_fkey` FOREIGN KEY (`B`) REFERENCES `Relatorio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
