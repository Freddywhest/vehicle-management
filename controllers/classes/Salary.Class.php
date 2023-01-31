<?php
    class Salary extends DataBase{
        public static int|string $currentPage;
        public static int|string $salaryId;

        public static int|string $amount;
        public static string $filter;
        public static int|string $receiverId;

        public static function payDriver():void{
            (new self)->__construct();
            $add = "INSERT INTO salary(amount, receiverId, receiver) VALUES (:amount, :receiverId, :receiver)";
            $addStmt = self::$pdo->prepare($add);
            $addStmt->execute([
                ':amount' => self::$amount,
                ':receiverId' => self::$receiverId,
                ':receiver' => 'driver'
            ]);

            echo json_encode([
                "status" => true,
                "message" => "Salary paid!"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }

        public static function payDrivers():void{
            (new self)->__construct();
            $drivers = "SELECT driverUuid, salary FROM drivers WHERE salary IS NOT NULL AND salary != ''";
            $driverStmt = self::$pdo->prepare($drivers);
            $driverStmt->execute();

            $allDrivers = $driverStmt->fetchAll(PDO::FETCH_ASSOC);
            $count = $driverStmt->rowCount();

            if($count < 1){
                echo json_encode([
                    "status" => false,
                    "message" => "Drivers salary column is empty so use [Pay to a driver] and select the driver to pay salary!"
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
                return;
            }

            foreach ($allDrivers as $driver) {
                $add = "INSERT INTO salary(amount, receiverId, receiver) VALUES (:amount, :receiverId, :receiver)";
                $addStmt = self::$pdo->prepare($add);
                $addStmt->execute([
                    ':amount' => $driver['salary'],
                    ':receiverId' => $driver['driverUuid'],
                    ':receiver' => 'driver'
                ]);
            }

            echo json_encode([
                "status" => true,
                "message" => "Salary paid!"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }

        public static function payWorker():void{
            (new self)->__construct();
            $add = "INSERT INTO salary(amount, receiverId, receiver) VALUES (:amount, :receiverId, :receiver)";
            $addStmt = self::$pdo->prepare($add);
            $addStmt->execute([
                ':amount' => self::$amount,
                ':receiverId' => self::$receiverId,
                ':receiver' => 'worker'
            ]);

            echo json_encode([
                "status" => true,
                "message" => "Salary paid!"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }

        public static function payWorkers():void{
            (new self)->__construct();
            $workers = "SELECT userUuid, salary FROM users WHERE userRole != 'superAdmin' AND salary IS NOT NULL AND salary != ''";
            $workerStmt = self::$pdo->prepare($workers);
            $workerStmt->execute();
            
            $allWorkers = $workerStmt->fetchAll(PDO::FETCH_ASSOC);
            $count = $workerStmt->rowCount();
            if($count < 1){
                echo json_encode([
                    "status" => false,
                    "message" => "Workers salary column is empty so use [Pay to a worker] and select the worker to pay salary!"
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
                return;
            }
            foreach ($allWorkers as $worker) {
                $add = "INSERT INTO salary(amount, receiverId, receiver) VALUES (:amount, :receiverId, :receiver)";
                $addStmt = self::$pdo->prepare($add);
                $addStmt->execute([
                    ':amount' => $worker['salary'],
                    ':receiverId' => $worker['userUuid'],
                    ':receiver' => 'worker'
                ]);
            }

            echo json_encode([
                "status" => true,
                "message" => "Salary paid!"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }

        public static function getSalary():void{
            (new self)->__construct();
            if(self::$filter === 'all'){
                $total = "SELECT amount FROM salary";
            }elseif(self::$filter === 'drivers'){
                $total = "SELECT amount FROM salary WHERE receiver = 'driver'";
            }elseif(self::$filter === 'workers'){
                $total = "SELECT amount FROM salary WHERE receiver = 'worker'";
            }else{
                $total = "SELECT amount FROM salary";
            }
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute();
            $totalSalary = $totalStmt->rowCount();

            $perPage = 10;
            $totalPages = ceil($totalSalary/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;

            if(self::$filter === 'all'){
                $salary = "SELECT salary.id, salary.amount, salary.salaryDate, salary.receiver, users.fullName, drivers.driverFullName FROM salary LEFT JOIN users ON users.userUuid = salary.receiverId LEFT JOIN drivers ON drivers.driverUuid = salary.receiverId ORDER BY salary.id DESC LIMIT :s, :t";
            }elseif(self::$filter === 'drivers'){
                $salary = "SELECT salary.id, salary.amount, salary.salaryDate, salary.receiver, users.fullName, drivers.driverFullName FROM salary LEFT JOIN users ON users.userUuid = salary.receiverId LEFT JOIN drivers ON drivers.driverUuid = salary.receiverId WHERE salary.receiver = 'driver' ORDER BY salary.id DESC LIMIT :s, :t";
            }elseif(self::$filter === 'workers'){
                $salary = "SELECT salary.id, salary.amount, salary.salaryDate, salary.receiver, users.fullName, drivers.driverFullName FROM salary LEFT JOIN users ON users.userUuid = salary.receiverId LEFT JOIN drivers ON drivers.driverUuid = salary.receiverId WHERE salary.receiver = 'worker' ORDER BY salary.id DESC LIMIT :s, :t";
            }else{
                $salary = "SELECT salary.id, salary.amount, salary.salaryDate, salary.receiver, users.fullName, drivers.driverFullName FROM salary LEFT JOIN users ON users.userUuid = salary.receiverId LEFT JOIN drivers ON drivers.driverUuid = salary.receiverId ORDER BY salary.id DESC LIMIT :s, :t";
            }

            $salaryStmt = self::$pdo->prepare($salary);
            $salaryStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);

            $data = $salaryStmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "status" => true,
                "data" => $data,
                "totalPages" => $totalPages,
                "totalSalaries" => $totalSalary,
                "role" => $_SESSION['userRole'],
                "currentPage" => self::$currentPage
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }

        public static function getSalaryByUser($userId):void{
            (new self)->__construct();
            if(self::$filter === 'all'){
                $total = "SELECT amount FROM salary WHERE receiverId =:id";
            }elseif(self::$filter === 'drivers'){
                $total = "SELECT amount FROM salary WHERE receiver = 'driver' AND receiverId =:id";
            }elseif(self::$filter === 'workers'){
                $total = "SELECT amount FROM salary WHERE receiver = 'worker' AND receiverId =:id";
            }else{
                $total = "SELECT amount FROM salary WHERE receiverId =:id";
            }
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute([
                ':id' => $userId
            ]);
            $totalSalary = $totalStmt->rowCount();

            $perPage = 10;
            $totalPages = ceil($totalSalary/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;

            if(self::$filter === 'all'){
                $salary = "SELECT salary.id, salary.amount, salary.salaryDate, salary.receiver, users.fullName, drivers.driverFullName FROM salary LEFT JOIN users ON users.userUuid = salary.receiverId LEFT JOIN drivers ON drivers.driverUuid = salary.receiverId WHERE salary.receiverId =:id ORDER BY salary.id DESC LIMIT :s, :t";
            }elseif(self::$filter === 'drivers'){
                $salary = "SELECT salary.id, salary.amount, salary.salaryDate, salary.receiver, users.fullName, drivers.driverFullName FROM salary LEFT JOIN users ON users.userUuid = salary.receiverId LEFT JOIN drivers ON drivers.driverUuid = salary.receiverId WHERE salary.receiver = 'driver' AND salary.receiverId =:id ORDER BY salary.id DESC LIMIT :s, :t";
            }elseif(self::$filter === 'workers'){
                $salary = "SELECT salary.id, salary.amount, salary.salaryDate, salary.receiver, users.fullName, drivers.driverFullName FROM salary LEFT JOIN users ON users.userUuid = salary.receiverId LEFT JOIN drivers ON drivers.driverUuid = salary.receiverId WHERE salary.receiver = 'worker' AND salary.receiverId =:id ORDER BY salary.id DESC LIMIT :s, :t";
            }else{
                $salary = "SELECT salary.id, salary.amount, salary.salaryDate, salary.receiver, users.fullName, drivers.driverFullName FROM salary LEFT JOIN users ON users.userUuid = salary.receiverId LEFT JOIN drivers ON drivers.driverUuid = salary.receiverId WHERE salary.receiverId =:id ORDER BY salary.id DESC LIMIT :s, :t";
            }

            $salaryStmt = self::$pdo->prepare($salary);
            $salaryStmt->execute([
                ':s' => $offset,
                ':t' => $perPage,
                ':id' => $userId
            ]);

            $data = $salaryStmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "status" => true,
                "data" => $data,
                "totalPages" => $totalPages,
                "totalSalaries" => $totalSalary,
                "role" => $_SESSION['userRole'],
                "currentPage" => self::$currentPage
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }


        public static function deleteSalary():void{
            (new self)->__construct();
            $delete = "DELETE FROM salary WHERE id =:id";
            $salaryStmt = self::$pdo->prepare($delete);
            $salaryStmt->execute([
                ':id' => self::$salaryId
            ]);

            echo json_encode([
                "StatusCode" => 200,
                "status" => true,
                "message" => "Salary deleted"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }

        public static function allDrivers(){
            $driverCheck = "SELECT driverFullName, driverUuid FROM drivers";
            $driverCheckStmt = self::$pdo->prepare($driverCheck);
            $driverCheckStmt->execute();

            $data = $driverCheckStmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                "status" => true,
                "data" => $data
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }

        public static function allWorkers(){
            $workerCheck = "SELECT userUuid, fullName FROM users WHERE userRole != 'superAdmin'";
            $workerCheckStmt = self::$pdo->prepare($workerCheck);
            $workerCheckStmt->execute();

            $data = $workerCheckStmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                "status" => true,
                "data" => $data
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }
    }