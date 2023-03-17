<?php
    class Driver extends DataBase {
        public static $currentPage;
        public static $driverId;

        public static $photo;
        public static $fullName;
        public static $bateOfBirth;
        public static $driverIdNo;
        public static $phoneHome;
        public static $phoneMobile;
        public static $idNumber;
        public static $email;
        public static $curAddress;
        public static $prevAddress;
        public static $prevCity;
        public static $prevRegion;
        public static $emergence;
        public static $crime;
        public static $position;
        public static $salary;
        public static $workedInCompany;
        public static $currentlyEmp;
        public static $preventedLawful;
        public static $convictedFelony;
        public static $drivingLicense;
        public static $highestEdu;
        public static $fullKnowledge;
        public static $expTractor;
        public static $expTruck;
        public static $expTrailer;
        public static $expBus;
        public static $expVan;
        public static $expTaxi;
        public static $accidentRecord;
        public static $traffic;

        public static function guidv4($data = null):string {
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

        
        public static function driverId():string | array {
            $newDriverId = sprintf("%06d", mt_rand(1, 999999));
            $idCheck = "SELECT driverIdNo FROM drivers WHERE driverIdNo =:id";
            $idCheckStmt = self::$pdo->prepare($idCheck);
            $idCheckStmt->execute([
                ':id' => $newDriverId
            ]);
            $idCount = $idCheckStmt->rowCount();
            if($idCount > 0){
                return $newDriverId + 5;
            }else{
                return $newDriverId;
            }
        }

        public static function getDrivers():void{
            (new self)->__construct();
            $total = "SELECT driverUuid FROM drivers";
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute();
            $totalDrivers = $totalStmt->rowCount();

            $perPage = 2;
            $totalPages = ceil($totalDrivers/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;

            $drivers = "SELECT drivers.driverUuid, drivers.driverFullName, drivers.driverIdNo, drivers.driverPhoto, drivers.email, vehicles.model, vehicles.regisNumber FROM drivers LEFT JOIN vehicles ON vehicles.drivenBy = drivers.driverUuid ORDER BY drivers.id DESC LIMIT :s, :t";
            $driversStmt = self::$pdo->prepare($drivers);
            $driversStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);

            $data = $driversStmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                "status" => true,
                "data" => $data,
                "totalPages" => $totalPages,
                "totalDrivers" => $totalDrivers,
                "currentPage" => self::$currentPage
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }

        public static function searchDrivers($search):void{
            (new self)->__construct();
            $total = "SELECT driverUuid FROM drivers WHERE driverFullName LIKE :search";
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute([
                ':search' => '%'.$search.'%'
            ]);
            $totalDrivers = $totalStmt->rowCount();

            $perPage = 2;
            $totalPages = ceil($totalDrivers/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;

            $drivers = "SELECT drivers.driverUuid, drivers.driverFullName, drivers.driverIdNo, drivers.driverPhoto, drivers.email, vehicles.model, vehicles.regisNumber FROM drivers LEFT JOIN vehicles ON vehicles.drivenBy = drivers.driverUuid WHERE drivers.driverFullName LIKE :search ORDER BY drivers.id DESC LIMIT :s, :t";
            $driversStmt = self::$pdo->prepare($drivers);
            $driversStmt->execute([
                ':s' => $offset,
                ':t' => $perPage,
                ':search' => '%'.$search.'%'
            ]);

            $data = $driversStmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                "status" => true,
                "data" => $data,
                "totalPages" => $totalPages,
                "totalDrivers" => $totalDrivers,
                "currentPage" => self::$currentPage
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }

        public static function addDriver():void{
            (new self)->__construct();
            $newUuid = self::guidv4();
    
            $searchUuid = "SELECT driverUuid FROM drivers WHERE driverUuid =:uuid";
            $searchUuidStmt = self::$pdo->prepare($searchUuid);
            $searchUuidStmt->execute([
                ':uuid' => $newUuid
            ]);
            $uuidCount = $searchUuidStmt->rowCount();

            if($uuidCount > 0){
                $driverUuid = $newUuid.'-'.time();
            }else{
                $driverUuid = $newUuid;
            }

            
            $newDriverId = self::driverId();

            $idCheck = "SELECT driverIdNo FROM drivers WHERE driverIdNo =:id";
            $idCheckStmt = self::$pdo->prepare($idCheck);
            $idCheckStmt->execute([
                ':id' => $newDriverId
            ]);
            $idCount = $idCheckStmt->rowCount();
            if($idCount > 0){
                self::$driverIdNo = $newDriverId.'DR';
            }else{
                self::$driverIdNo = $newDriverId;
            }

            $addDriver = "INSERT INTO drivers(driverPhoto, driverFullName, bateOfBirth, driverIdNo, phoneHome, phoneMobile, idNumber, email, curAddress, prevAddress, prevCity, prevRegion, emergence, crime, position, salary, workedInCompany, currentlyEmp, preventedLawful, convictedFelony, drivingLicense, highestEdu, fullKnowledge, expTractor, expTruck, expTrailer, expBus, expVan, expTaxi, accidentRecord, traffic, driverUuid, dateAdded) VALUES (:photo, :fullName, :bateOfBirth, :driverIdNo, :phoneHome, :phoneMobile, :idNumber, :email, :curAddress, :prevAddress, :prevCity, :prevRegion, :emergence, :crime, :position, :salary, :workedInCompany, :currentlyEmp, :preventedLawful, :convictedFelony, :drivingLicense, :highestEdu, :fullKnowledge, :expTractor, :expTruck, :expTrailer, :expBus, :expVan, :expTaxi, :accidentRecord, :traffic, :driverUuid, :dateAdded)";
            $addDriverStmt = self::$pdo->prepare($addDriver);
            $addDriverStmt->execute([
                ':photo' => self::$photo, 
                ':fullName' => self::$fullName, 
                ':bateOfBirth' => self::$bateOfBirth, 
                ':driverIdNo' => self::$driverIdNo, 
                ':phoneHome' => self::$phoneHome, 
                ':phoneMobile' => self::$phoneMobile, 
                ':idNumber' => self::$idNumber, 
                ':email' => self::$email, 
                ':curAddress' => self::$curAddress, 
                ':prevAddress' => self::$prevAddress, 
                ':prevCity' => self::$prevCity, 
                ':prevRegion' => self::$prevRegion, 
                ':emergence' => self::$emergence, 
                ':crime' => self::$crime, 
                ':position' => self::$position, 
                ':salary' => self::$salary, 
                ':workedInCompany' => self::$workedInCompany, 
                ':currentlyEmp' => self::$currentlyEmp, 
                ':preventedLawful' => self::$preventedLawful, 
                ':convictedFelony' => self::$convictedFelony, 
                ':drivingLicense' => self::$drivingLicense, 
                ':highestEdu' => self::$highestEdu, 
                ':fullKnowledge' => self::$fullKnowledge, 
                ':expTractor' => self::$expTractor, 
                ':expTruck' => self::$expTruck, 
                ':expTrailer' => self::$expTrailer, 
                ':expBus' => self::$expBus, 
                ':expVan' => self::$expVan, 
                ':expTaxi' => self::$expTaxi, 
                ':accidentRecord' => self::$accidentRecord, 
                ':traffic' => self::$traffic, 
                ':driverUuid' => $driverUuid, 
                ':dateAdded' => date('F j, Y')
            ]);
        }

        public static function updateDriver():void{
            (new self)->__construct();

            $addDriver = "UPDATE drivers SET driverPhoto =:photo, driverFullName =:fullName, bateOfBirth =:bateOfBirth, phoneHome =:phoneHome, phoneMobile =:phoneMobile, idNumber =:idNumber, email =:email, curAddress =:curAddress, prevAddress =:prevAddress, prevCity =:prevCity, prevRegion =:prevRegion, emergence =:emergence, position =:position, salary =:salary, workedInCompany =:workedInCompany, preventedLawful =:preventedLawful, convictedFelony =:convictedFelony, drivingLicense =:drivingLicense, highestEdu =:highestEdu, fullKnowledge =:fullKnowledge, expTractor =:expTractor, expTruck =:expTruck, expTrailer =:expTrailer, expBus =:expBus, expVan =:expVan, expTaxi =:expTaxi, accidentRecord =:accidentRecord, traffic =:traffic WHERE driverUuid =:driverUuid";
            $addDriverStmt = self::$pdo->prepare($addDriver);
            $addDriverStmt->execute([
                ':photo' => self::$photo, 
                ':fullName' => self::$fullName, 
                ':bateOfBirth' => self::$bateOfBirth,
                ':phoneHome' => self::$phoneHome, 
                ':phoneMobile' => self::$phoneMobile, 
                ':idNumber' => self::$idNumber, 
                ':email' => self::$email, 
                ':curAddress' => self::$curAddress, 
                ':prevAddress' => self::$prevAddress, 
                ':prevCity' => self::$prevCity, 
                ':prevRegion' => self::$prevRegion, 
                ':emergence' => self::$emergence, 
                ':position' => self::$position, 
                ':salary' => self::$salary, 
                ':workedInCompany' => self::$workedInCompany, 
                ':preventedLawful' => self::$preventedLawful, 
                ':convictedFelony' => self::$convictedFelony, 
                ':drivingLicense' => self::$drivingLicense, 
                ':highestEdu' => self::$highestEdu, 
                ':fullKnowledge' => self::$fullKnowledge, 
                ':expTractor' => self::$expTractor, 
                ':expTruck' => self::$expTruck, 
                ':expTrailer' => self::$expTrailer, 
                ':expBus' => self::$expBus, 
                ':expVan' => self::$expVan, 
                ':expTaxi' => self::$expTaxi, 
                ':accidentRecord' => self::$accidentRecord, 
                ':traffic' => self::$traffic, 
                ':driverUuid' => self::$driverId, 
            ]);
        }

        public static function getDriver():void{

            $drivers = "SELECT drivers.driverUuid, drivers.driverFullName, drivers.driverIdNo, drivers.driverPhoto, drivers.email, vehicles.model, vehicles.regisNumber, drivers.bateOfBirth, drivers.phoneHome, drivers.phoneMobile, drivers.idNumber, drivers.curAddress, drivers.prevAddress, drivers.prevCity, drivers.prevRegion, drivers.emergence, drivers.crime, drivers.position, drivers.salary, drivers.workedInCompany, drivers.currentlyEmp, drivers.preventedLawful, drivers.convictedFelony, drivers.drivingLicense, drivers.highestEdu, drivers.fullKnowledge, drivers.expTractor, drivers.expTruck, drivers.expTrailer, drivers.expBus, drivers.expVan, drivers.expTaxi, drivers.accidentRecord, drivers.traffic, drivers.dateAdded FROM drivers LEFT JOIN vehicles ON vehicles.drivenBy = drivers.driverUuid WHERE drivers.driverUuid =:did";
            $driversStmt = self::$pdo->prepare($drivers);
            $driversStmt->execute([
                ':did' => self::$driverId
            ]);

            $data = $driversStmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode([
                "status" => true,
                "data" => $data
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }

        public static function getADriver($driverId): array{

            $drivers = "SELECT drivers.driverUuid, drivers.driverFullName, drivers.driverIdNo, drivers.driverPhoto, drivers.email, vehicles.model, vehicles.regisNumber, drivers.bateOfBirth, drivers.phoneHome, drivers.phoneMobile, drivers.idNumber, drivers.curAddress, drivers.prevAddress, drivers.prevCity, drivers.prevRegion, drivers.emergence, drivers.crime, drivers.position, drivers.salary, drivers.workedInCompany, drivers.currentlyEmp, drivers.preventedLawful, drivers.convictedFelony, drivers.drivingLicense, drivers.highestEdu, drivers.fullKnowledge, drivers.expTractor, drivers.expTruck, drivers.expTrailer, drivers.expBus, drivers.expVan, drivers.expTaxi, drivers.accidentRecord, drivers.traffic, drivers.dateAdded FROM drivers LEFT JOIN vehicles ON vehicles.drivenBy = drivers.driverUuid WHERE driverUuid =:did";
            $driversStmt = self::$pdo->prepare($drivers);
            $driversStmt->execute([
                ':did' => $driverId
            ]);

            $data = $driversStmt->fetch(PDO::FETCH_ASSOC);
            $count = $driversStmt->rowCount();
           return [
                "data" => $data,
                "count" => $count
            ];

        }

        public static function deleteDriver($driverId): void{

            $delete = "DELETE FROM drivers WHERE driverUuid =:did";
            $driversStmt = self::$pdo->prepare($delete);
            $driversStmt->execute([
                ':did' => $driverId
            ]);

            echo json_encode([
                "status" => true,
                "data" => 'deleted'
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }

    }