-- CreateTable
CREATE TABLE `Branch` (
    `branchId` CHAR(36) NOT NULL,
    `branchName` VARCHAR(255) NOT NULL,
    `branchAddress` VARCHAR(255) NOT NULL,
    `companyId` CHAR(36) NOT NULL,
    `countryId` INTEGER NOT NULL,
    `branchCreatedAt` DATETIME(6) NOT NULL DEFAULT (now()),
    `branchUpdatedAt` DATETIME(6) NOT NULL DEFAULT (now()),

    INDEX `companyId`(`companyId`),
    INDEX `countryId`(`countryId`),
    PRIMARY KEY (`branchId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BranchClosure` (
    `branchClosureId` CHAR(36) NOT NULL,
    `branchId` CHAR(36) NOT NULL,
    `branchClosureDate` DATE NOT NULL,
    `branchClosureIsFullDay` BOOLEAN NOT NULL DEFAULT true,
    `branchClosureOpeningTime` TIME(0) NULL,
    `branchClosureClosingTime` TIME(0) NULL,
    `branchClosureReason` VARCHAR(255) NULL,
    `branchClosureCreatedAt` DATETIME(6) NOT NULL DEFAULT (now()),
    `branchClosureUpdatedAt` DATETIME(6) NOT NULL DEFAULT (now()),

    UNIQUE INDEX `BranchClosure_index_1`(`branchId`, `branchClosureDate`),
    PRIMARY KEY (`branchClosureId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BranchHour` (
    `branchHourId` CHAR(36) NOT NULL,
    `branchId` CHAR(36) NOT NULL,
    `branchHourDayOfWeek` TINYINT NOT NULL,
    `branchHourOpeningTime` TIME(0) NOT NULL,
    `branchHourClosingTime` TIME(0) NOT NULL,
    `branchHourCreatedAt` DATETIME(6) NOT NULL DEFAULT (now()),
    `branchHourUpdatedAt` DATETIME(6) NOT NULL DEFAULT (now()),

    UNIQUE INDEX `BranchHour_index_0`(`branchId`, `branchHourDayOfWeek`),
    PRIMARY KEY (`branchHourId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Company` (
    `companyId` CHAR(36) NOT NULL,
    `companyName` VARCHAR(255) NOT NULL,
    `companyEmail` VARCHAR(255) NULL,
    `companyContactPhone` VARCHAR(255) NULL,
    `companyCreatedAt` DATETIME(6) NOT NULL DEFAULT (now()),
    `companyUpdatedAt` DATETIME(6) NOT NULL DEFAULT (now()),

    UNIQUE INDEX `companyName`(`companyName`),
    UNIQUE INDEX `companyEmail`(`companyEmail`),
    PRIMARY KEY (`companyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CompanySetting` (
    `companySettingId` CHAR(36) NOT NULL,
    `companySettingCurrencyId` CHAR(36) NOT NULL,

    INDEX `companySettingCurrencyId`(`companySettingCurrencyId`),
    PRIMARY KEY (`companySettingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Country` (
    `countryId` INTEGER NOT NULL AUTO_INCREMENT,
    `countryName` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `countryName`(`countryName`),
    PRIMARY KEY (`countryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Court` (
    `courtId` CHAR(36) NOT NULL,
    `courtName` VARCHAR(255) NULL,
    `sportCourtTypeId` CHAR(36) NOT NULL,
    `courtStatusId` CHAR(36) NOT NULL,
    `branchId` CHAR(36) NOT NULL,
    `courtCreatedAt` DATETIME(6) NOT NULL DEFAULT (now()),
    `courtUpdatedAt` DATETIME(6) NOT NULL DEFAULT (now()),

    INDEX `branchId`(`branchId`),
    INDEX `courtStatusId`(`courtStatusId`),
    INDEX `sportCourtTypeId`(`sportCourtTypeId`),
    PRIMARY KEY (`courtId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourtPricing` (
    `courtPricingId` CHAR(36) NOT NULL,
    `courtId` CHAR(36) NOT NULL,
    `courtPricingDayOfWeek` TINYINT NOT NULL,
    `courtPricingStartTime` TIME(0) NOT NULL,
    `courtPricingEndTime` TIME(0) NOT NULL,
    `courtPricingPerHour` DECIMAL(7, 2) NOT NULL,
    `courtPricingCreatedAt` DATETIME(6) NOT NULL DEFAULT (now()),
    `courtPricingUpdatedAt` DATETIME(6) NOT NULL DEFAULT (now()),

    UNIQUE INDEX `CourtPricing_index_2`(`courtId`, `courtPricingDayOfWeek`, `courtPricingStartTime`),
    UNIQUE INDEX `CourtPricing_index_3`(`courtId`, `courtPricingDayOfWeek`, `courtPricingEndTime`),
    PRIMARY KEY (`courtPricingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourtStatus` (
    `courtStatusId` CHAR(36) NOT NULL,
    `courtStatusName` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `courtStatusName`(`courtStatusName`),
    PRIMARY KEY (`courtStatusId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Currency` (
    `currencyId` CHAR(36) NOT NULL,
    `currencyISO` CHAR(3) NOT NULL,
    `currencySymbol` CHAR(1) NOT NULL,
    `currencyName` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `currencyISO`(`currencyISO`),
    PRIMARY KEY (`currencyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reservation` (
    `reservationId` CHAR(36) NOT NULL,
    `reservationHolderName` VARCHAR(255) NOT NULL,
    `reservationContactPhone` VARCHAR(255) NULL,
    `reservationEmail` VARCHAR(255) NULL,
    `courtId` CHAR(36) NOT NULL,
    `reservationDate` DATE NOT NULL,
    `reservationStartTime` TIME(0) NOT NULL,
    `reservarionEndTime` TIME(0) NOT NULL,
    `reservationTotalPrice` DECIMAL(7, 2) NOT NULL,
    `reservationNote` VARCHAR(255) NULL,
    `reservationStatusId` CHAR(36) NOT NULL,
    `reservationCreatedAt` DATETIME(6) NOT NULL DEFAULT (now()),
    `reservationtUpdatedAt` DATETIME(6) NOT NULL DEFAULT (now()),

    INDEX `courtId`(`courtId`),
    INDEX `reservationStatusId`(`reservationStatusId`),
    PRIMARY KEY (`reservationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReservationStatus` (
    `reservationStatusId` CHAR(36) NOT NULL,
    `reservationStatusName` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `reservationStatusName`(`reservationStatusName`),
    PRIMARY KEY (`reservationStatusId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SportCategory` (
    `sportCategoryId` CHAR(36) NOT NULL,
    `sportCategoryName` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `sportCategoryName`(`sportCategoryName`),
    PRIMARY KEY (`sportCategoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SportCourtType` (
    `sportCourtTypeId` CHAR(36) NOT NULL,
    `sportCourtTypeName` VARCHAR(255) NOT NULL,
    `sportCategoryId` CHAR(36) NOT NULL,

    UNIQUE INDEX `sportCourtTypeName`(`sportCourtTypeName`),
    INDEX `sportCategoryId`(`sportCategoryId`),
    PRIMARY KEY (`sportCourtTypeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `userId` CHAR(36) NOT NULL,
    `userName` VARCHAR(255) NOT NULL,
    `userEmail` VARCHAR(255) NOT NULL,
    `userPassword` VARCHAR(255) NOT NULL,
    `companyId` CHAR(36) NOT NULL,
    `userCreatedAt` DATETIME(6) NOT NULL DEFAULT (now()),
    `userUpdatedAt` DATETIME(6) NOT NULL DEFAULT (now()),
    `roleId` CHAR(36) NOT NULL,

    UNIQUE INDEX `userEmail`(`userEmail`),
    INDEX `companyId`(`companyId`),
    INDEX `roleId`(`roleId`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `roleId` CHAR(36) NOT NULL,
    `roleName` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `roleName`(`roleName`),
    PRIMARY KEY (`roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Branch` ADD CONSTRAINT `branch_ibfk_1` FOREIGN KEY (`companyId`) REFERENCES `Company`(`companyId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Branch` ADD CONSTRAINT `branch_ibfk_2` FOREIGN KEY (`countryId`) REFERENCES `Country`(`countryId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `BranchClosure` ADD CONSTRAINT `branchclosure_ibfk_1` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`branchId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `BranchHour` ADD CONSTRAINT `branchhour_ibfk_1` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`branchId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `CompanySetting` ADD CONSTRAINT `companysetting_ibfk_1` FOREIGN KEY (`companySettingId`) REFERENCES `Company`(`companyId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `CompanySetting` ADD CONSTRAINT `companysetting_ibfk_2` FOREIGN KEY (`companySettingCurrencyId`) REFERENCES `Currency`(`currencyId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Court` ADD CONSTRAINT `court_ibfk_1` FOREIGN KEY (`sportCourtTypeId`) REFERENCES `SportCourtType`(`sportCourtTypeId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Court` ADD CONSTRAINT `court_ibfk_2` FOREIGN KEY (`courtStatusId`) REFERENCES `CourtStatus`(`courtStatusId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Court` ADD CONSTRAINT `court_ibfk_3` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`branchId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `CourtPricing` ADD CONSTRAINT `courtpricing_ibfk_1` FOREIGN KEY (`courtId`) REFERENCES `Court`(`courtId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`courtId`) REFERENCES `Court`(`courtId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`reservationStatusId`) REFERENCES `ReservationStatus`(`reservationStatusId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `SportCourtType` ADD CONSTRAINT `sportcourttype_ibfk_1` FOREIGN KEY (`sportCategoryId`) REFERENCES `SportCategory`(`sportCategoryId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`companyId`) REFERENCES `Company`(`companyId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `user_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `Role`(`roleId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
