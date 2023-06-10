<?php 
    class Totals extends DataBase{
        public static $filter;
        public static function bankBalance() : array{
            $totalDeposit = 0;
            $totalWithdraw = 0;

            $depositQuery = "SELECT amount FROM bank WHERE transactionType = 'deposit'";
            $withdrawQuery = "SELECT amount FROM bank WHERE transactionType = 'withdraw'";

            $depositStmt = parent::$pdo->prepare($depositQuery);
            $withdrawStmt = parent::$pdo->prepare($withdrawQuery);

            $depositStmt->execute();
            $withdrawStmt->execute();

            $deposits = $depositStmt->fetchAll(PDO::FETCH_ASSOC);
            $withdraws = $withdrawStmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($deposits as $deposit) {
                $totalDeposit += $deposit['amount'];
            }

            foreach ($withdraws as $withdraw) {
                $totalWithdraw += $withdraw['amount'];
            }

            $bankBalance = $totalDeposit - $totalWithdraw;

            return [
                "bankBalance" => number_format($bankBalance, isset(explode('.', $bankBalance)[1]) && strlen(explode('.', $bankBalance)[1]) > 2 ? strlen(explode('.', $bankBalance)[1]) : 2,'.', ','),
                "totalWithdraw" => number_format($totalWithdraw, isset(explode('.', $totalWithdraw)[1]) && strlen(explode('.', $totalWithdraw)[1]) > 2 ? strlen(explode('.', $totalWithdraw)[1]) : 2,'.', ','),
                "totalDeposit" => number_format($totalDeposit, isset(explode('.', $totalDeposit)[1]) && strlen(explode('.', $totalDeposit)[1]) > 2 ? strlen(explode('.', $totalDeposit)[1]) : 2,'.', ',')
            ];

        }

        public static function totalExpenses():array{
            $getExpense = "SELECT amount FROM workshop";
            $stmt = parent::$pdo->prepare($getExpense);
            $stmt->execute();

            $totalExpenses = 0;

            $expenses = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach($expenses as $expense){
                $totalExpenses += $expense['amount'];
            }

            return [
                "totalExpenses" => number_format($totalExpenses, isset(explode('.', $totalExpenses)[1]) && strlen(explode('.', $totalExpenses)[1]) > 2 ? strlen(explode('.', $totalExpenses)[1]) : 2,'.', ',')
            ];
        }

        public static function totalSalesFilter():array{
            $getQMonth = is_numeric(explode('-', self::$filter)[0]) && is_numeric(explode('-', self::$filter)[1]) ? self::$filter : date('Y').'-'.date('m');
            $getExpense = "SELECT amount FROM sales WHERE DATE_FORMAT(sales.salesDate, '%Y-%m') ='".$getQMonth."'";
            $stmt = parent::$pdo->prepare($getExpense);
            $stmt->execute();

            $totalFiltered = 0;

            $filteredSales = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach($filteredSales as $filteredSale){
                $totalFiltered += $filteredSale['amount'];
            }

            return [
                "totalSalesFilter" => number_format($totalFiltered, isset(explode('.', $totalFiltered)[1]) && strlen(explode('.', $totalFiltered)[1]) > 2 ? strlen(explode('.', $totalFiltered)[1]) : 2,'.', ',')
            ];
        }

        public static function totalSales():array{
            $getSales = "SELECT amount FROM sales";
            $todaySales = "SELECT amount FROM sales WHERE salesDate = CURDATE()";
            $stmt = parent::$pdo->prepare($getSales);
            $stmt2 = parent::$pdo->prepare($todaySales);
            $stmt->execute();
            $stmt2->execute();

            $totalSales = 0;
            $totalToday = 0;

            $sales = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $todays = $stmt2->fetchAll(PDO::FETCH_ASSOC);
            foreach($sales as $sale){
                $totalSales += $sale['amount'];
            }

            foreach($todays as $today){
                $totalToday += $today['amount'];
            }

            return [
                "totalSales" => number_format($totalSales, isset(explode('.', $totalSales)[1]) && strlen(explode('.', $totalSales)[1]) > 2 ? strlen(explode('.', $totalSales)[1]) : 2,'.', ','),
                "totalToday" => number_format($totalToday, isset(explode('.', $totalToday)[1]) && strlen(explode('.', $totalToday)[1]) > 2 ? strlen(explode('.', $totalToday)[1]) : 2,'.', ',')
            ];
        }

        public static function totalUsers():array{
            $drivers = "SELECT id FROM drivers";
            $workers = "SELECT id FROM users WHERE userRole = 'attendant'";
            $admins = "SELECT id FROM users WHERE userRole = 'admin'";
            $vehicles = "SELECT id FROM vehicles";

            $stmtD = parent::$pdo->prepare($drivers);
            $stmtW = parent::$pdo->prepare($workers);
            $stmtA = parent::$pdo->prepare($admins);
            $stmtV = parent::$pdo->prepare($vehicles);

            $stmtD->execute();
            $stmtW->execute();
            $stmtA->execute();
            $stmtV->execute();

            $totalD = $stmtD->rowCount();
            $totalW = $stmtW->rowCount();
            $totalA = $stmtA->rowCount();
            $totalV = $stmtV->rowCount();

            return [
                "totalDrivers" => number_format($totalD, 0,'.', ','),
                "totalWorkers" => number_format($totalW, 0,'.', ','),
                "totalAdmins" => number_format($totalA, 0,'.', ','),
                "totalVehicles" => number_format($totalV, 0,'.', ','),
            ];
        }

        public static function allTotals():array {
            return [
                "sales" => self::totalSales(),
                "bank" => self::bankBalance(),
                "user" => self::totalUsers(),
                "expenses" => self::totalExpenses()
            ];
        }
    }