<?php
    class Bank extends DataBase{
        public static string|int $amount;
        public static string $recordedBy;
        public static string $purpose;
        public static string|int $bankId;
        public static string|int $currentPage;
        public static string $filter = 'all';

        public static function deposit():void{
            (new self)->__construct();
            $deposit = "INSERT INTO bank(amount, transactionDate, transactionType, recordedBy) VALUES(:amount, :transactionDate, :transactionType, :recordedBy)";
            $stmt = self::$pdo->prepare($deposit);
            $stmt->execute([
                ':amount' => self::$amount,
                ':transactionDate' => date('Y-m-d'),
                ':transactionType' => 'deposit',
                ':recordedBy' => self::$recordedBy
            ]);

            echo json_encode([
                "status" => true,
                "message" => "Deposited!"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }

        public static function withdraw():void{
            (new self)->__construct();
            $deposit = "INSERT INTO bank(amount, transactionDate, transactionType, recordedBy, purpose) VALUES(:amount, :transactionDate, :transactionType, :recordedBy, :purpose)";
            $stmt = self::$pdo->prepare($deposit);
            $stmt->execute([
                ':amount' => self::$amount,
                ':transactionDate' => date('Y-m-d'),
                ':transactionType' => 'withdraw',
                ':recordedBy' => self::$recordedBy,
                ':purpose' => self::$purpose
            ]);

            echo json_encode([
                "status" => true,
                "message" => "Withdrew!"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }

        public static function deleteBank():void{
            (new self)->__construct();
            $delete = "DELETE FROM bank WHERE id =:id";
            $stmt = self::$pdo->prepare($delete);
            $stmt->execute([
                ':id' => self::$bankId
            ]);

            echo json_encode([
                "StatusCode" => 200,
                "status" => true,
                "message" => "Transaction deleted"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }

        public static function getBank():void{
            (new self)->__construct();
            if(self::$filter === 'all'){
                $total = "SELECT amount FROM bank";
            }elseif(self::$filter === 'deposit'){
                $total = "SELECT amount FROM bank WHERE transactionType = 'deposit'";
            }elseif(self::$filter === 'withdraw'){
                $total = "SELECT amount FROM bank WHERE transactionType = 'withdraw'";
            }else{
                $total = "SELECT amount FROM bank";
            }
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute();
            $total = $totalStmt->rowCount();

            $perPage = 10;
            $totalPages = ceil($total/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;

            if(self::$filter === 'all'){
                $bank = "SELECT bank.id, bank.amount, bank.transactionType, bank.purpose, bank.transactionDate, users.fullName FROM bank LEFT JOIN users ON users.userUuid = bank.recordedBy ORDER BY bank.id DESC LIMIT :s, :t";
            }elseif(self::$filter === 'deposits'){
                $bank = "SELECT bank.id, bank.amount, bank.transactionType, bank.purpose, bank.transactionDate, users.fullName FROM bank LEFT JOIN users ON users.userUuid = bank.recordedBy WHERE bank.transactionType = 'deposit' ORDER BY bank.id DESC LIMIT :s, :t";
            }elseif(self::$filter === 'withdraws'){
                $bank = "SELECT bank.id, bank.amount, bank.transactionType, bank.purpose, bank.transactionDate, users.fullName FROM bank LEFT JOIN users ON users.userUuid = bank.recordedBy WHERE bank.transactionType = 'withdraw' ORDER BY bank.id DESC LIMIT :s, :t";
            }else{
                $bank = "SELECT bank.id, bank.amount, bank.transactionType, bank.purpose, bank.transactionDate, users.fullName FROM bank LEFT JOIN users ON users.userUuid = bank.recordedBy ORDER BY bank.id DESC LIMIT :s, :t";
            }

            $bankStmt = self::$pdo->prepare($bank);
            $bankStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);

            $data = $bankStmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "status" => true,
                "data" => $data,
                "totalPages" => $totalPages,
                "total" => $total,
                "role" => $_SESSION['userRole'],
                "currentPage" => self::$currentPage
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }

        public static function getBankDetails(){
            $detail = "SELECT bank.id, bank.amount, bank.transactionType, bank.purpose, bank.transactionDate, users.fullName FROM bank LEFT JOIN users ON users.userUuid = bank.recordedBy WHERE bank.id =:id";
            $stmt = parent::$pdo->prepare($detail);
            $stmt->execute([
                ':id' => self::$bankId
            ]);

            $data = $stmt->fetch(PDO::FETCH_ASSOC);

            echo json_encode([
                "status" => true,
                "data" => $data
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }
    }