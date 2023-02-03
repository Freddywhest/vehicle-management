<?php
    class Sales extends DataBase{
        public static int|string $currentPage;
        public static int|string $salesId;
        public static string $filter = 'all';

        public static int|string $amount;
        public static string $driver;

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

        public static function addSale(){
            (new self)->__construct();
            $newUuid = self::guidv4();

            $sales = "SELECT salesUuid FROM sales WHERE salesUuid =:uuid";
            $salesStmt = self::$pdo->prepare($sales);
            $salesStmt->execute([
                ':uuid' => $newUuid
            ]);
            $count = $salesStmt->rowCount();

            if($count > 0){
                $saleUuid = $newUuid.'-'.time();
            }else{
                $saleUuid = $newUuid;
            }

            $add = "INSERT INTO sales(amount, salesDate, driver, recordedBy, salesUuid) VALUES (:amount, :salesDate, :driver, :recorder, :uuid)";
            $addStmt = self::$pdo->prepare($add);
            $addStmt->execute([
                ':amount' => self::$amount,
                ':salesDate' => date('Y-m-d'),
                ':driver' => self::$driver,
                ':recorder' => $_SESSION['userUuid'],
                ':uuid' => $saleUuid
            ]);

            echo json_encode([
                "status" => true,
                "message" => "Sales added successfully!"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }

        public static function getSales(){
            (new self)->__construct();
            if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'){
                if(self::$filter === 'all'){
                    $total = "SELECT salesUuid FROM sales";
                }elseif(self::$filter === 'today'){
                    $total = "SELECT salesUuid FROM sales WHERE salesDate = CURDATE()";
                }else{
                    $total = "SELECT salesUuid FROM sales";
                }
                $totalStmt = self::$pdo->prepare($total);
                $totalStmt->execute();
            }else{
                if(self::$filter === 'all'){
                    $total = "SELECT salesUuid FROM sales WHERE recordedBy =:recordedBy";
                }elseif(self::$filter === 'today'){
                    $total = "SELECT salesUuid FROM sales WHERE salesDate = CURDATE() AND recordedBy =:recordedBy";
                }else{
                    $total = "SELECT salesUuid FROM sales AND recordedBy =:recordedBy";
                }
                $totalStmt = self::$pdo->prepare($total);
                $totalStmt->execute([
                    ':recordedBy' => $_SESSION['userUuid']
                ]);

            }

            $totalSales = $totalStmt->rowCount();

            $perPage = 5;
            $totalPages = ceil($totalSales/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;

            if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'){
                if(self::$filter === 'all'){
                    $sales = "SELECT sales.amount, sales.driver, sales.salesDate, drivers.driverFullName, users.fullName, sales.salesUuid FROM sales LEFT JOIN drivers ON drivers.driverUuid = sales.driver LEFT JOIN users ON users.userUuid = sales.recordedBy ORDER BY sales.id DESC LIMIT :s, :t";
                }elseif(self::$filter === 'today'){
                    $sales = "SELECT sales.amount, sales.driver, sales.salesDate, drivers.driverFullName, users.fullName FROM sales LEFT JOIN drivers ON drivers.driverUuid = sales.driver LEFT JOIN users ON users.userUuid = sales.recordedBy WHERE sales.salesDate = CURDATE() ORDER BY sales.id DESC LIMIT :s, :t";
                }else{
                    $sales = "SELECT sales.amount, sales.driver, sales.salesDate, drivers.driverFullName, users.fullName, sales.salesUuid FROM sales LEFT JOIN drivers ON drivers.driverUuid = sales.driver LEFT JOIN users ON users.userUuid = sales.recordedBy ORDER BY sales.id DESC LIMIT :s, :t";
                }
                $salesStmt = self::$pdo->prepare($sales);
                $salesStmt->execute([
                    ':s' => $offset,
                    ':t' => $perPage
                ]);
            }else{
                if(self::$filter === 'all'){
                    $sales = "SELECT sales.amount, sales.driver, sales.salesDate, drivers.driverFullName, users.fullName, sales.salesUuid FROM sales LEFT JOIN drivers ON drivers.driverUuid = sales.driver LEFT JOIN users ON users.userUuid = sales.recordedBy WHERE sales.recordedBy =:recordedBy ORDER BY sales.id DESC LIMIT :s, :t";
                }elseif(self::$filter === 'today'){
                    $sales = "SELECT sales.amount, sales.driver, sales.salesDate, drivers.driverFullName, users.fullName FROM sales LEFT JOIN drivers ON drivers.driverUuid = sales.driver LEFT JOIN users ON users.userUuid = sales.recordedBy WHERE sales.salesDate = CURDATE() AND sales.recordedBy =:recordedBy ORDER BY sales.id DESC LIMIT :s, :t";
                }else{
                    $sales = "SELECT sales.amount, sales.driver, sales.salesDate, drivers.driverFullName, users.fullName, sales.salesUuid FROM sales LEFT JOIN drivers ON drivers.driverUuid = sales.driver LEFT JOIN users ON users.userUuid = sales.recordedBy WHERE sales.recordedBy =:recordedBy ORDER BY sales.id DESC LIMIT :s, :t";
                }
                $salesStmt = self::$pdo->prepare($sales);
                $salesStmt->execute([
                    ':recordedBy' => $_SESSION['recordedBy'],
                    ':s' => $offset,
                    ':t' => $perPage
                ]);
            }
            

            $data = $salesStmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "status" => true,
                "data" => $data,
                "totalPages" => $totalPages,
                "totalSales" => $totalSales,
                "role" => $_SESSION['userRole'],
                "currentPage" => self::$currentPage
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }

        public static function getSalesByUser(){
            (new self)->__construct();
            if(self::$filter === 'all'){
                $total = "SELECT salesUuid FROM sales WHERE recordedBy =:rid";
            }elseif(self::$filter === 'today'){
                $total = "SELECT salesUuid FROM sales WHERE salesDate = CURDATE() AND recordedBy =:rid";
            }else{
                $total = "SELECT salesUuid FROM sales WHERE recordedBy =:rid";
            }
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute([
                ':rid' => $_SESSION['userUuid']
            ]);
            $totalSales = $totalStmt->rowCount();

            $perPage = 5;
            $totalPages = ceil($totalSales/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;

            if(self::$filter === 'all'){
                $sales = "SELECT sales.amount, sales.driver, sales.salesDate, drivers.driverFullName, users.fullName, sales.salesUuid FROM sales LEFT JOIN drivers ON drivers.driverUuid = sales.driver LEFT JOIN users ON users.userUuid = sales.recordedBy WHERE sales.recordedBy =:rid ORDER BY sales.id DESC LIMIT :s, :t";
            }elseif(self::$filter === 'today'){
                $sales = "SELECT sales.amount, sales.driver, sales.salesDate, drivers.driverFullName, users.fullName FROM sales LEFT JOIN drivers ON drivers.driverUuid = sales.driver LEFT JOIN users ON users.userUuid = sales.recordedBy WHERE sales.salesDate = CURDATE() AND sales.recordedBy =:rid ORDER BY sales.id DESC LIMIT :s, :t";
            }else{
                $sales = "SELECT sales.amount, sales.driver, sales.salesDate, drivers.driverFullName, users.fullName, sales.salesUuid FROM sales LEFT JOIN drivers ON drivers.driverUuid = sales.driver LEFT JOIN users ON users.userUuid = sales.recordedBy WHERE sales.recordedBy =:rid ORDER BY sales.id DESC LIMIT :s, :t";
            }
            $salesStmt = self::$pdo->prepare($sales);
            $salesStmt->execute([
                ':s' => $offset,
                ':t' => $perPage,
                ':rid' => $_SESSION['userUuid']
            ]);

            $data = $salesStmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "status" => true,
                "data" => $data,
                "totalPages" => $totalPages,
                "totalSales" => $totalSales,
                "role" => $_SESSION['userRole'],
                "currentPage" => self::$currentPage
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }

        public static function getSalesByDriver($userId){
            (new self)->__construct();
            if(self::$filter === 'all'){
                $total = "SELECT salesUuid FROM sales WHERE driver =:did";
            }elseif(self::$filter === 'today'){
                $total = "SELECT salesUuid FROM sales WHERE salesDate = CURDATE() AND driver =:did";
            }else{
                $total = "SELECT salesUuid FROM sales WHERE driver =:did";
            }
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute([
                ':did' => $userId
            ]);
            $totalSales = $totalStmt->rowCount();

            $perPage = 5;
            $totalPages = ceil($totalSales/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;

            if(self::$filter === 'all'){
                $sales = "SELECT sales.amount, sales.driver, sales.salesDate, drivers.driverFullName, users.fullName, sales.salesUuid FROM sales LEFT JOIN drivers ON drivers.driverUuid = sales.driver LEFT JOIN users ON users.userUuid = sales.recordedBy WHERE sales.driver =:did ORDER BY sales.id DESC LIMIT :s, :t";
            }elseif(self::$filter === 'today'){
                $sales = "SELECT sales.amount, sales.driver, sales.salesDate, drivers.driverFullName, users.fullName FROM sales LEFT JOIN drivers ON drivers.driverUuid = sales.driver LEFT JOIN users ON users.userUuid = sales.recordedBy WHERE sales.salesDate = CURDATE() AND sales.driver =:did ORDER BY sales.id DESC LIMIT :s, :t";
            }else{
                $sales = "SELECT sales.amount, sales.driver, sales.salesDate, drivers.driverFullName, users.fullName, sales.salesUuid FROM sales LEFT JOIN drivers ON drivers.driverUuid = sales.driver LEFT JOIN users ON users.userUuid = sales.recordedBy WHERE sales.driver =:did ORDER BY sales.id DESC LIMIT :s, :t";
            }
            $salesStmt = self::$pdo->prepare($sales);
            $salesStmt->execute([
                ':s' => $offset,
                ':t' => $perPage,
                ':did' => $userId
            ]);

            $data = $salesStmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "status" => true,
                "data" => $data,
                "totalPages" => $totalPages,
                "totalSales" => $totalSales,
                "role" => $_SESSION['userRole'],
                "currentPage" => self::$currentPage
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }

        /* public static function todaySales(){
            (new self)->__construct();
            $total = "SELECT salesUuid FROM sales";
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute();
            $totalSales = $totalStmt->rowCount();

            $perPage = 1;
            $totalPages = ceil($totalSales/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;

            $sales = "SELECT sales.amount, sales.driver, sales.salesDate, drivers.driverFullName, users.fullName FROM sales LEFT JOIN drivers ON drivers.driverIdNo = sales.driver LEFT JOIN users ON users.userUuid = sales.recordedBy WHERE sales.salesDate = CURDATE() ORDER BY sales.id DESC LIMIT :s, :t";
            $salesStmt = self::$pdo->prepare($sales);
            $salesStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);

            $data = $salesStmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "status" => true,
                "data" => $data,
                "totalPages" => $totalPages,
                "totalSales" => $totalSales,
                "currentPage" => self::$currentPage
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        } */

        /* public static function getSale(){
            (new self)->__construct();
            $sale = "SELECT sales.amount, sales.driver, sales.salesDate, drivers.driverFullName, users.fullName, sales.salesUuid FROM sales LEFT JOIN drivers ON drivers.driverIdNo = sales.driver LEFT JOIN users ON users.userUuid = sales.recordedBy WHERE salesUuid =:id";
            $saleStmt = self::$pdo->prepare($sale);
            $saleStmt->execute([
                ':id' => self::$salesId
            ]);

            $count = $saleStmt->rowCount();
            if($count < 1){
                echo json_encode([
                    "StatusCode" => 404,
                    "status" => false,
                    "message" => "Not Found"
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            }else{
                $data = $saleStmt->fetch(PDO::FETCH_ASSOC);
    
                echo json_encode([
                    "StatusCode" => 200,
                    "status" => true,
                    "data" => $data
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

            }

        } */

        public static function deleteSale(){
            (new self)->__construct();
            $delete = "DELETE FROM sales WHERE salesUuid =:id";
            $saleStmt = self::$pdo->prepare($delete);
            $saleStmt->execute([
                ':id' => self::$salesId
            ]);

            echo json_encode([
                "StatusCode" => 200,
                "status" => true,
                "message" => "Sale deleted successfully!"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }

        public static function checkDriver(){
            $driverCheck = "SELECT driverPhoto, driverIdNo, driverFullName, driverUuid FROM drivers WHERE driverIdNo =:dId";
            $driverCheckStmt = self::$pdo->prepare($driverCheck);
            $driverCheckStmt->execute([
                ':dId' => self::$driver
            ]);

            $driverCount = $driverCheckStmt->rowCount();
            if($driverCount < 1){
                echo json_encode([
                    "statusCode" => 404,
                    "status" => false,
                    "message" => "Driver with Driver's Identity Number: [".self::$driver."] is not found!"
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

            }else{
                $data = $driverCheckStmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode([
                    "statusCode" => 200,
                    "status" => true,
                    "data" => $data,
                    "message" => "Driver with Driver's Identity Number: [".self::$driver."] is found!"
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            }
        }
    }