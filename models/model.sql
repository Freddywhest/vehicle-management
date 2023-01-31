

CREATE TABLE `bank` (
  `id` int(11) NOT NULL,
  `amount` varchar(255) DEFAULT NULL,
  `transactionDate` date NOT NULL,
  `transactionType` varchar(255) NOT NULL,
  `recordedBy` varchar(255) NOT NULL,
  `purpose` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;


CREATE TABLE `drivers` (
  `id` int(11) NOT NULL,
  `driverPhoto` varchar(255) DEFAULT NULL,
  `driverFullName` varchar(255) NOT NULL,
  `bateOfBirth` varchar(255) DEFAULT NULL,
  `driverIdNo` varchar(255) DEFAULT NULL,
  `phoneHome` varchar(30) DEFAULT NULL,
  `phoneMobile` varchar(30) DEFAULT NULL,
  `idNumber` varchar(50) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `curAddress` varchar(255) DEFAULT NULL,
  `prevAddress` varchar(255) DEFAULT NULL,
  `prevCity` varchar(255) DEFAULT NULL,
  `prevRegion` varchar(255) DEFAULT NULL,
  `emergence` varchar(255) DEFAULT NULL,
  `crime` text DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `salary` varchar(255) DEFAULT NULL,
  `workedInCompany` varchar(255) DEFAULT NULL,
  `currentlyEmp` varchar(255) DEFAULT NULL,
  `preventedLawful` varchar(255) DEFAULT NULL,
  `convictedFelony` varchar(255) DEFAULT NULL,
  `drivingLicense` varchar(255) DEFAULT NULL,
  `highestEdu` varchar(255) DEFAULT NULL,
  `fullKnowledge` varchar(255) DEFAULT NULL,
  `expTractor` text DEFAULT NULL,
  `expTruck` text DEFAULT NULL,
  `expTrailer` text DEFAULT NULL,
  `expBus` text DEFAULT NULL,
  `expVan` text DEFAULT NULL,
  `expTaxi` text DEFAULT NULL,
  `accidentRecord` text DEFAULT NULL,
  `traffic` text DEFAULT NULL,
  `driverUuid` varchar(255) NOT NULL,
  `dateAdded` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;


CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `inventoryName` varchar(255) NOT NULL,
  `vehicleBrand` varchar(255) NOT NULL,
  `inventoryCondition` varchar(20) NOT NULL,
  `quantity` varchar(255) NOT NULL,
  `photo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `salary` (
  `id` int(11) NOT NULL,
  `amount` varchar(255) DEFAULT NULL,
  `salaryDate` date NOT NULL,
  `receiverId` varchar(255) NOT NULL,
  `receiver` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;


CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `amount` varchar(255) DEFAULT NULL,
  `salesDate` date NOT NULL,
  `driver` varchar(255) NOT NULL,
  `recordedBy` varchar(200) NOT NULL,
  `salesUuid` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;


CREATE TABLE `settings` (
  `siteLogo` varchar(255) DEFAULT NULL,
  `siteName` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `fullName` varchar(255) NOT NULL,
  `bateOfBirth` varchar(255) DEFAULT NULL,
  `phoneOne` varchar(30) DEFAULT NULL,
  `phoneTwo` varchar(30) DEFAULT NULL,
  `idNumber` varchar(50) DEFAULT NULL,
  `userEmail` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `crime` text DEFAULT NULL,
  `employmentType` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `salary` varchar(255) DEFAULT NULL,
  `dateToStart` varchar(255) DEFAULT NULL,
  `schoolName` varchar(255) DEFAULT NULL,
  `schoolLocation` varchar(255) DEFAULT NULL,
  `dateGrad` varchar(255) DEFAULT NULL,
  `experience` varchar(255) DEFAULT NULL,
  `companyName` text DEFAULT NULL,
  `periodFrom` text DEFAULT NULL,
  `periodTo` text DEFAULT NULL,
  `companyPosition` text DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `majorSkills` text DEFAULT NULL,
  `userUuid` varchar(255) NOT NULL,
  `userRole` varchar(255) NOT NULL,
  `userStatus` varchar(50) NOT NULL DEFAULT 'active',
  `userPassword` varchar(255) NOT NULL,
  `userDefaultPass` varchar(50) NOT NULL DEFAULT 'yes'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;


CREATE TABLE `vehicles` (
  `id` int(11) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `model` varchar(255) NOT NULL,
  `color` varchar(200) DEFAULT NULL,
  `vtype` varchar(255) NOT NULL,
  `engineNo` varchar(200) NOT NULL,
  `trans` varchar(200) NOT NULL,
  `axle` varchar(200) NOT NULL,
  `paint` varchar(255) NOT NULL,
  `trim` varchar(255) NOT NULL,
  `chasis` varchar(255) NOT NULL,
  `converted` varchar(255) NOT NULL,
  `drivenBy` varchar(255) NOT NULL,
  `other` text DEFAULT NULL,
  `regisNumber` varchar(50) DEFAULT NULL,
  `vehicleUuid` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;


CREATE TABLE `workshop` (
  `id` int(11) NOT NULL,
  `amount` varchar(255) DEFAULT NULL,
  `expenseDate` date NOT NULL,
  `purpose` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

ALTER TABLE `bank`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `drivers`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `salary`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `workshop`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `bank`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `drivers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `salary`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `workshop`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;
