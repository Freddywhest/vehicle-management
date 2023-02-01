<?php
declare(strict_types = 1);


    class Models extends DataBase{
        public static string $userName;
        public static string $userPass;
        public static string $userEmail;
        public static string $siteLogo;
        public static string $siteName;
        protected static string $tableName;

        static public function websiteSettings(){
            self::$tableName = 'settings';
            $websiteSettings = "CREATE TABLE IF NOT EXISTS 
            ".self::$tableName." (
            siteLogo varchar(255) NULL DEFAULT NULL,
            siteName varchar(255) NULL DEFAULT NULL
            ) ENGINE = InnoDB";
            $websiteSettingsStmt = self::$pdo->prepare($websiteSettings);
            $websiteSettingsStmt->execute();
        }

        static public function guidv4($data = null) {
            // Generate 16 bytes (128 bits) of random data or use the data passed into the function.
            $data = $data ?? random_bytes(16);
            assert(strlen($data) == 16);
        
            // Set version to 0100
            $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
            // Set bits 6-7 to 10
            $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
        
            // Output the 36 character UUID.
            return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
        }

        public static function dropTable(){
            $dropDatabase = "DROP DATABASE IF EXISTS `bank`, `drivers`, `inventory`, `salary`, `sales`, `settings`, `users`, `vehicles`, `workshop`";
            $dropDatabaseStmt = self::$pdo->prepare($dropDatabase);
            $dropDatabaseStmt->execute();
        }
        
        static public function users(){
            self::$tableName = 'users';
            $users = "CREATE TABLE IF NOT EXISTS 
            ".self::$tableName." (
                id int(11) NOT NULL AUTO_INCREMENT,
                photo varchar(255) DEFAULT NULL,
                fullName varchar(255) NOT NULL,
                bateOfBirth varchar(255) DEFAULT NULL,
                phoneOne varchar(30) DEFAULT NULL,
                phoneTwo varchar(30) DEFAULT NULL,
                idNumber varchar(50) DEFAULT NULL,
                userEmail varchar(255) NOT NULL,
                address varchar(255) DEFAULT NULL,
                city varchar(255) DEFAULT NULL,
                region varchar(255) DEFAULT NULL,
                crime text DEFAULT NULL,
                employmentType varchar(255) DEFAULT NULL,
                position varchar(255) DEFAULT NULL,
                salary varchar(255) DEFAULT NULL,
                dateToStart varchar(255) DEFAULT NULL,
                schoolName varchar(255) DEFAULT NULL,
                schoolLocation varchar(255) DEFAULT NULL,
                dateGrad varchar(255) DEFAULT NULL,
                experience varchar(255) DEFAULT NULL,
                companyName text DEFAULT NULL,
                periodFrom text DEFAULT NULL,
                periodTo text DEFAULT NULL,
                companyPosition text DEFAULT NULL,
                reason text DEFAULT NULL,
                majorSkills text DEFAULT NULL,
                userUuid varchar(255) NOT NULL,
                userRole varchar(255) NOT NULL,
                userPassword varchar(255) NOT NULL,
                userStatus varchar(50) NOT NULL DEFAULT 'active',
                userDefaultPass varchar(50) NOT NULL DEFAULT 'yes',
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC";
            $usersStmt = self::$pdo->prepare($users);
            $usersStmt->execute();
        }

        
        static public function drivers(){
            self::$tableName = 'drivers';
            $drivers = "CREATE TABLE IF NOT EXISTS 
            ".self::$tableName." (
                id int(11) NOT NULL AUTO_INCREMENT,
                driverPhoto varchar(255) DEFAULT NULL,
                driverFullName varchar(255) NOT NULL,
                bateOfBirth varchar(255) DEFAULT NULL,
                driverIdNo varchar(255) DEFAULT NULL,
                phoneHome varchar(30) DEFAULT NULL,
                phoneMobile varchar(30) DEFAULT NULL,
                idNumber varchar(50) DEFAULT NULL,
                email varchar(255) NOT NULL,
                curAddress varchar(255) DEFAULT NULL,
                prevAddress varchar(255) DEFAULT NULL,
                prevCity varchar(255) DEFAULT NULL,
                prevRegion varchar(255) DEFAULT NULL,
                emergence varchar(255) DEFAULT NULL,
                crime text DEFAULT NULL,
                position varchar(255) DEFAULT NULL,
                salary varchar(255) DEFAULT NULL,
                workedInCompany varchar(255) DEFAULT NULL,
                currentlyEmp varchar(255) DEFAULT NULL,
                preventedLawful varchar(255) DEFAULT NULL,
                convictedFelony varchar(255) DEFAULT NULL,
                drivingLicense varchar(255) DEFAULT NULL,
                highestEdu varchar(255) DEFAULT NULL,
                fullKnowledge varchar(255) DEFAULT NULL,
                expTractor text DEFAULT NULL,
                expTruck text DEFAULT NULL,
                expTrailer text DEFAULT NULL,
                expBus text DEFAULT NULL,
                expVan text DEFAULT NULL,
                expTaxi text DEFAULT NULL,
                accidentRecord text DEFAULT NULL,
                traffic text DEFAULT NULL,
                driverUuid varchar(255) NOT NULL,
                dateAdded DATE NOT NULL,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC";
            $driversStmt = self::$pdo->prepare($drivers);
            $driversStmt->execute();
        }

        
        static public function vehicles(){
            self::$tableName = 'vehicles';
            $vehicles = "CREATE TABLE IF NOT EXISTS 
            ".self::$tableName." (
                id int(11) NOT NULL AUTO_INCREMENT,
                photo varchar(255) DEFAULT NULL,
                model varchar(255) NOT NULL,
                color varchar(255) NOT NULL,
                vtype varchar(255) NOT NULL,
                engineNo varchar(200) NOT NULL,
                trans varchar(200) NOT NULL,
                axle varchar(200) NOT NULL,
                paint varchar(255) NOT NULL,
                trim varchar(255) NOT NULL,
                chasis varchar(255) NOT NULL,
                converted varchar(255) NOT NULL,
                drivenBy varchar(255) NOT NULL,
                other text DEFAULT NULL,
                regisNumber varchar(255) DEFAULT NULL,
                dateAdded DATE NOT NULL,
                vehicleUuid varchar(255) NOT NULL,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC";
            $vehiclesStmt = self::$pdo->prepare($vehicles);
            $vehiclesStmt->execute();
        }

        
        static public function sales(){
            self::$tableName = 'sales';
            $sales = "CREATE TABLE IF NOT EXISTS 
            ".self::$tableName." (
                id int(11) NOT NULL AUTO_INCREMENT,
                amount varchar(255) DEFAULT NULL,
                salesDate DATE NOT NULL,
                driver varchar(255) NOT NULL,
                recordedBy varchar(200) NOT NULL,
                salesUuid varchar(255) NOT NULL,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC";
            $salesStmt = self::$pdo->prepare($sales);
            $salesStmt->execute();
        }


        static public function bank(){
            self::$tableName = 'bank';
            $bank = "CREATE TABLE IF NOT EXISTS 
            ".self::$tableName." (
                id int(11) NOT NULL AUTO_INCREMENT,
                amount varchar(255) DEFAULT NULL,
                transactionDate DATE NOT NULL,
                transactionType varchar(255) NOT NULL,
                recordedBy varchar(200) NOT NULL,
                purpose TEXT NULL DEFAULT NULL,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC";
            $bankStmt = self::$pdo->prepare($bank);
            $bankStmt->execute();
        }


        static public function salary(){
            self::$tableName = 'salary';
            $salary = "CREATE TABLE IF NOT EXISTS 
            ".self::$tableName." (
                id int(11) NOT NULL AUTO_INCREMENT,
                amount varchar(255) DEFAULT NULL,
                salaryDate DATE NOT NULL,
                receiverId varchar(255) NOT NULL,
                receiver VARCHAR(50) NOT NULL,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC";
            $salaryStmt = self::$pdo->prepare($salary);
            $salaryStmt->execute();
        }


        static public function inventory(){
            self::$tableName = 'inventory';
            $inventory = "CREATE TABLE IF NOT EXISTS 
            ".self::$tableName." (
                id int(11) NOT NULL AUTO_INCREMENT,
                inventoryName varchar(255) NOT NULL,
                vehicleBrand varchar(255) NOT NULL,
                inventoryCondition varchar(20) NOT NULL,
                quantity VARCHAR(255) NOT NULL,
                photo VARCHAR(255) NOT NULL,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC";
            $inventoryStmt = self::$pdo->prepare($inventory);
            $inventoryStmt->execute();
        }


        static public function workShop(){
            self::$tableName = 'workshop';
            $workshop = "CREATE TABLE IF NOT EXISTS 
            ".self::$tableName." (
                id int(11) NOT NULL AUTO_INCREMENT,
                amount varchar(255) DEFAULT NULL,
                expenseDate DATE NOT NULL,
                purpose text DEFAULT NULL,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC";
            $workshopStmt = self::$pdo->prepare($workshop);
            $workshopStmt->execute();
        }


        static public function addUser(){
            $passHash = password_hash(self::$userPass, PASSWORD_DEFAULT);
            $myuuid = self::guidv4();
            $addUser = "INSERT INTO users(userEmail, fullName, userPassword, userUuid, userRole, userDefaultPass) VALUES (:uemail, :uname, :upass, :uuid, :urole, :userDefaultPass)";
            $addUserStmt = self::$pdo->prepare($addUser);
            $addUserStmt->execute([
                ':uemail' => self::$userEmail,
                ':uname' => self::$userName,
                ':upass' => $passHash,
                ':uuid' => $myuuid,
                ':urole' => 'superAdmin',
                ':userDefaultPass' => 'no'
            ]);
        }

        static public function addWebsite(){
            $addWebsite = "INSERT INTO settings(siteLogo, siteName) VALUES (:siteLogo, :siteName)";
            $addWebsiteStmt = self::$pdo->prepare($addWebsite);
            $addWebsiteStmt->execute([
                ':siteLogo' => self::$siteLogo,
                ':siteName' => self::$siteName
            ]);
        }
    }