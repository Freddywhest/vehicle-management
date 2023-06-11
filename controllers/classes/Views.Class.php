<?php 
    class Views{
        public function Home(){
            $getMonthsAndYears = array_unique(Sales::getMonthsAndYears());
            $getSalesDates = json_encode(array_unique(Sales::getDates()), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            include $_SERVER['DOCUMENT_ROOT'].'/views/index.phtml';
        }

        public function Login(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Authentication/login.phtml';
        }

        public function Workers(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Users/workers.phtml';
        }

        public function Drivers(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Users/drivers.phtml';
        }

        public function Sales(){
            $getSalesDates = json_encode(array_unique(Sales::getDates()), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            $getMonthsAndYears = array_unique(Sales::getMonthsAndYears());
            include $_SERVER['DOCUMENT_ROOT'].'/views/Sales/sales.phtml';
        }

        public function AddSales(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Sales/add-sale.phtml';
        }

        public function Salaries(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Salaries/salaries.phtml';
        }

        public function PayWorker(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Salaries/pay-worker.phtml';
        }

        public function PayDriver(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Salaries/pay-driver.phtml';
        }
        
        public function BankDeposit(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Bank/bank-deposit.phtml';
        }

        public function BankWithdraw(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Bank/bank-withdraw.phtml';
        }

        public function BankTransactions(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Bank/bank-transactions.phtml';
        }

        public function Settings(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Settings/settings.phtml';
        }

        public function Profile(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Users/profile.phtml';
        }

        public function Workshop(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Workshop/all-workshop.phtml';
        }

        public function AddWorkshop(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Workshop/workshop.phtml';
        }

        public function Vehicles(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Vehicles/vehicles.phtml';
        }

        public function DriverSale(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Sales/driver-sales.phtml';
        }

        public function WorkerSalary(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Salaries/worker-salary.phtml';
        }

        public function Inventories(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Inventories/inventories.phtml';
        }

        public function AddInventories(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Inventories/add-inventory.phtml';
        }

        public function EditInventories($params){
            $inventory = Inventory::getInventory($params[0]);
            if($inventory['count'] < 1){
                include $_SERVER['DOCUMENT_ROOT'].'/views/404.php';
                return;
            }
            include $_SERVER['DOCUMENT_ROOT'].'/views/Inventories/edit-inventory.phtml';
        }

        public function EditVehicles($params){
            Vehicles::$vehicleId = $params[0];
            $vehicle = Vehicles::getVehicle();
            if($vehicle['count'] < 1){
                include $_SERVER['DOCUMENT_ROOT'].'/views/404.php';
                return;
            }
            include $_SERVER['DOCUMENT_ROOT'].'/views/Vehicles/edit-vehicle.phtml';
        }

        public function EditWorkers($params){
            $worker = Worker::getAWorker($params[0]);
            if($worker['count'] < 1){
                include $_SERVER['DOCUMENT_ROOT'].'/views/404.php';
                return;
            }
            include $_SERVER['DOCUMENT_ROOT'].'/views/Users/edit-worker.phtml';
        }

        public function EditDriver($params){
            $driver = Driver::getADriver($params[0]);
            if($driver['count'] < 1){
                include $_SERVER['DOCUMENT_ROOT'].'/views/404.php';
                return;
            }
            include $_SERVER['DOCUMENT_ROOT'].'/views/Users/edit-driver.phtml';
        }
    }