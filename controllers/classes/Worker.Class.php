<?php
    class Worker extends DataBase {
        public static $fullName;
        public static $DoB;
        public static $workerPhone1;
        public static $workerPhone2;
        public static $workerId;
        public static $workerEmail;
        public static $workerAddress;
        public static $workerCity;
        public static $workerRegion;
        public static $crimeExplain;
        public static $workerEmpType;
        public static $workerEmpPosition;
        public static $workerEmpSalary;
        public static $workerStartDate;
        public static $workerExpCompany;
        public static $workerExpFrom;
        public static $workerExpTo;
        public static $workerExpPosition;
        public static $reasonLeaving;
        public static $eduSchoolName;
        public static $eduSchoolLocation;
        public static $userRole;
        public static $eduSchoolGrad;
        public static $majorSkills;
        public static $photo;
        public static $userPassword;
        public static $currentPage;
        public static $userUuid;
        public static $userStatus;
        public static bool $userExist = false;

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

        public static function checkEmail (): bool {
                (new self)->__construct();
    
                $searchEmail = "SELECT userEmail FROM users WHERE userEmail =:email";
                $searchEmailStmt = self::$pdo->prepare($searchEmail);
                $searchEmailStmt->execute([
                    ':email' => self::$workerEmail
                ]);
                $emailCount = $searchEmailStmt->rowCount();
    
                if($emailCount > 0){
                    return self::$userExist = true;
                }else{
                    return false;
                }
        }

        public static function addWorker() {
            (new self)->__construct();

            $searchEmail = "SELECT userEmail FROM users WHERE userEmail =:email";
            $searchEmailStmt = self::$pdo->prepare($searchEmail);
            $searchEmailStmt->execute([
                ':email' => self::$workerEmail
            ]);
            $emailCount = $searchEmailStmt->rowCount();

            if($emailCount > 0){
                self::$userExist = true;
            }else{
                $newUuid = self::guidv4();
    
                $searchUuid = "SELECT userUuid FROM users WHERE userUuid =:uuid";
                $searchUuidStmt = self::$pdo->prepare($searchUuid);
                $searchUuidStmt->execute([
                    ':uuid' => $newUuid
                ]);
                $uuidCount = $searchUuidStmt->rowCount();

                if($uuidCount > 0){
                    $userUuid = $newUuid.'-'.time();
                }else{
                    $userUuid = $newUuid;
                }

                $userPassword = password_hash(self::$userPassword, PASSWORD_DEFAULT);
                $add = "INSERT INTO users(photo, fullName, bateOfBirth, phoneOne, phoneTwo, idNumber, userEmail, address, city, region, crime, employmentType, position, salary, dateToStart, schoolName, schoolLocation, dateGrad, companyName, periodFrom, periodTo, companyPosition, reason, majorSkills, userUuid, userRole, userPassword) VALUES (:photo, :fullName, :DoB, :workerPhone1, :workerPhone2, :workerId, :workerEmail, :workerAddress, :workerCity, :workerRegion, :crimeExplain, :workerEmpType, :workerEmpPosition, :workerEmpSalary, :workerStartDate, :eduSchoolName, :eduSchoolLocation, :eduSchoolGrad, :workerExpCompany, :workerExpFrom, :workerExpTo, :workerExpPosition, :reasonLeaving, :majorSkills, :userUuid, :userRole, :userPassword)";
                $addStmt = self::$pdo->prepare($add);
                $addStmt->execute([
                    ':photo' => self::$photo,
                    ':fullName' => self::$fullName,
                    ':DoB' => self::$DoB,
                    ':workerPhone1' => self::$workerPhone1,
                    ':workerPhone2' => self::$workerPhone2,
                    ':workerId' => self::$workerId,
                    ':workerEmail' => self::$workerEmail,
                    ':workerAddress' => self::$workerAddress,
                    ':workerCity' => self::$workerCity,
                    ':workerRegion' => self::$workerRegion,
                    ':crimeExplain' => self::$crimeExplain,
                    ':workerEmpType' => self::$workerEmpType,
                    ':workerEmpPosition' => self::$workerEmpPosition,
                    ':workerEmpSalary' => self::$workerEmpSalary,
                    ':workerStartDate' => self::$workerStartDate,
                    ':eduSchoolName' => self::$eduSchoolName,
                    ':eduSchoolLocation' => self::$eduSchoolLocation,
                    ':eduSchoolGrad' => self::$eduSchoolGrad,
                    ':workerExpCompany' => self::$workerExpCompany,
                    ':workerExpFrom' => self::$workerExpFrom,
                    ':workerExpTo' => self::$workerExpTo,
                    ':workerExpPosition' => self::$workerExpPosition,
                    ':reasonLeaving' => self::$reasonLeaving,
                    ':majorSkills' => self::$majorSkills,
                    ':userUuid' => $userUuid,
                    ':userRole' => self::$userRole,
                    ':userPassword' => $userPassword
                ]);
            }
        }

        public static function getWorkers() {
            (new self)->__construct();
            $total = "SELECT userUuid FROM users";
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute();
            $totalWorkers = $totalStmt->rowCount();

            $perPage = 15;
            $totalPages = ceil($totalWorkers/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;

            $workers = "SELECT userUuid, fullName, userEmail, photo, userRole, userStatus FROM users WHERE userRole != 'superAdmin' ORDER BY id DESC LIMIT :s, :t";
            $workersStmt = self::$pdo->prepare($workers);
            $workersStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);

            $data = $workersStmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "status" => true,
                "data" => $data,
                "totalPages" => $totalPages,
                "totalWorkers" => $totalWorkers,
                "currentPage" => self::$currentPage
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }

        public static function getWorker($userId) {
            (new self)->__construct();
            $workers = "SELECT * FROM users WHERE userUuid =:id";
            $workersStmt = self::$pdo->prepare($workers);
            $workersStmt->execute([
                ':id' => $userId,
            ]);

            $data = $workersStmt->fetch(PDO::FETCH_ASSOC);

            echo json_encode([
                "status" => true,
                "data" => $data
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }

        public static function getAWorker($userId):array {
            (new self)->__construct();
            $workers = "SELECT * FROM users WHERE userUuid =:id";
            $workersStmt = self::$pdo->prepare($workers);
            $workersStmt->execute([
                ':id' => $userId,
            ]);

            $data = $workersStmt->fetch(PDO::FETCH_ASSOC);
            $count = $workersStmt->rowCount();

            return [
                "data" => $data,
                "count" => $count
            ];

        }

        public static function updateWorker() {
            (new self)->__construct();
            $add = "UPDATE users SET photo =:photo, fullName =:fullName, bateOfBirth =:DoB, phoneOne =:workerPhone1, phoneTwo =:workerPhone2, idNumber =:workerId, userEmail =:workerEmail, address =:workerAddress, city =:workerCity, region =:workerRegion, crime =:crimeExplain, employmentType =:workerEmpType, position =:workerEmpPosition, salary =:workerEmpSalary, dateToStart =:workerStartDate, schoolName =:eduSchoolName, schoolLocation =:eduSchoolLocation, dateGrad =:eduSchoolGrad, companyName =:workerExpCompany, periodFrom =:workerExpFrom, periodTo =:workerExpTo, companyPosition =:workerExpPosition, reason =:reasonLeaving, majorSkills =:majorSkills, userRole =:userRole WHERE userUuid =:userUuid";
            $addStmt = self::$pdo->prepare($add);
            $addStmt->execute([
                ':photo' => self::$photo,
                ':fullName' => self::$fullName,
                ':DoB' => self::$DoB,
                ':workerPhone1' => self::$workerPhone1,
                ':workerPhone2' => self::$workerPhone2,
                ':workerId' => self::$workerId,
                ':workerEmail' => self::$workerEmail,
                ':workerAddress' => self::$workerAddress,
                ':workerCity' => self::$workerCity,
                ':workerRegion' => self::$workerRegion,
                ':crimeExplain' => self::$crimeExplain,
                ':workerEmpType' => self::$workerEmpType,
                ':workerEmpPosition' => self::$workerEmpPosition,
                ':workerEmpSalary' => self::$workerEmpSalary,
                ':workerStartDate' => self::$workerStartDate,
                ':eduSchoolName' => self::$eduSchoolName,
                ':eduSchoolLocation' => self::$eduSchoolLocation,
                ':eduSchoolGrad' => self::$eduSchoolGrad,
                ':workerExpCompany' => self::$workerExpCompany,
                ':workerExpFrom' => self::$workerExpFrom,
                ':workerExpTo' => self::$workerExpTo,
                ':workerExpPosition' => self::$workerExpPosition,
                ':reasonLeaving' => self::$reasonLeaving,
                ':majorSkills' => self::$majorSkills,
                ':userUuid' => self::$userUuid,
                ':userRole' => self::$userRole
            ]);

            echo json_encode([
                "status" => true,
                "message" => "Worker successfully added!",
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }

        public static function updateWorkerPassword() {
            (new self)->__construct();
            $newPassword = sprintf("%06d", mt_rand(1, 999999));
            $userPassword = password_hash($newPassword, PASSWORD_DEFAULT);

            $add = "UPDATE users SET userPassword =:userPassword, userDefaultPass =:userDefaultPass WHERE userUuid =:userUuid";
            $addStmt = self::$pdo->prepare($add);
            $addStmt->execute([
                ':userPassword' => $userPassword,
                ':userDefaultPass' =>'yes',
                ':userUuid' => self::$userUuid
            ]);

            echo json_encode([
                "status" => true,
                "newPassword" => $newPassword,
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }
        

        public static function updatePassword($default) {
            (new self)->__construct();
            $userPassword = password_hash(self::$userPassword, PASSWORD_DEFAULT);

            $add = "UPDATE users SET userPassword =:userPassword, userDefaultPass =:userDefaultPass WHERE userUuid =:userUuid";
            $addStmt = self::$pdo->prepare($add);
            $addStmt->execute([
                ':userPassword' => $userPassword,
                ':userDefaultPass' => $default,
                ':userUuid' => self::$userUuid
            ]);

            echo json_encode([
                "status" => true,
                "message" => "Updated",
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }
        

        public static function deleteWorker() {
            (new self)->__construct();

            $delete = "DELETE FROM users WHERE userUuid =:userUuid";
            $addStmt = self::$pdo->prepare($delete);
            $addStmt->execute([
                ':userUuid' => self::$userUuid
            ]);

            echo json_encode([
                "status" => true,
                "message" => "Deleted",
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }


        public static function updateWorkerStatus() {
            $add = "UPDATE users SET userStatus =:userStatus WHERE userUuid =:userUuid)";
            $addStmt = self::$pdo->prepare($add);
            $addStmt->execute([
                ':userStatus' => self::$userStatus,
                ':userUuid' => self::$userUuid
            ]);

            echo json_encode([
                "status" => true,
                "message" => "Updated",
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }
    }

