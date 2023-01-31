<?php
    class Workshop extends DataBase{
        public static string|int $currentPage;
        public static string $workshopId;
        public static string $filter;

        public static string|int $amount;
        public static string $purpose;

        public static function addWorkshop(){
            (new self)->__construct();
            $add = "INSERT INTO workshop (amount, purpose) VALUES (:amount, :purpose)";
            $addStmt = self::$pdo->prepare($add);
            $addStmt->execute([
                ':amount' => self::$amount,
                ':purpose' => self::$purpose
            ]);

            echo json_encode([
                "status" => true,
                "message" => "Expense added!"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }

        public static function getWorkshop(){
            (new self)->__construct();
            if(isset(self::$filter) && self::$filter === 'all'){
                $total = "SELECT amount FROM workshop";
            }else if(isset(self::$filter) && self::$filter === 'today'){
                $total = "SELECT amount FROM workshop WHERE expenseDate = CURDATE()";
            }else{
                $total = "SELECT amount FROM workshop";
            }
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute();
            $totalWorkshop = $totalStmt->rowCount();

            $perPage = 10;
            $totalPages = ceil($totalWorkshop/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;

            if(isset(self::$filter) && self::$filter === 'all'){
                $workshop = "SELECT * FROM workshop ORDER BY id DESC LIMIT :s, :t";
            }else if(isset(self::$filter) && self::$filter === 'today'){
                $workshop = "SELECT * FROM workshop WHERE  expenseDate = CURDATE() ORDER BY id DESC LIMIT :s, :t";
            }else{
                $workshop = "SELECT * FROM workshop ORDER BY id DESC LIMIT :s, :t";
            }
            
            $workshopStmt = self::$pdo->prepare($workshop);
            $workshopStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);

            $data = $workshopStmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "status" => true,
                "data" => $data,
                "totalPages" => $totalPages,
                "totalWorkshop" => $totalWorkshop,
                "currentPage" => self::$currentPage,
                "role" => $_SESSION['userRole']
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }

        public static function getExpense(){
            $expense = "SELECT * FROM workshop WHERE id =:id";
            $stmt = parent::$pdo->prepare($expense);
            $stmt->execute([
                ':id' => self::$workshopId
            ]);

            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode([
                "status" => true,
                "data" => $data
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }


        public static function deleteWorkshop(){
            (new self)->__construct();
            $delete = "DELETE FROM workshop WHERE id =:id";
            $workshopStmt = self::$pdo->prepare($delete);
            $workshopStmt->execute([
                ':id' => self::$workshopId
            ]);

            echo json_encode([
                "StatusCode" => 200,
                "status" => true,
                "message" => "Expense deleted"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }

    }