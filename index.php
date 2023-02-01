<?php 
session_start();
include $_SERVER['DOCUMENT_ROOT'].'/vendor/autoloader.php';

if(file_exists($_SERVER['DOCUMENT_ROOT'].'/controllers/classes/DataBase.Class.php') && class_exists('DataBase') && Settings::getSettings() !== NULL){
    Settings::getSettings();
    if(isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) && isset($_COOKIE['userUuid'])){
        $loggedInUser = LoginUser::getLoginUser();
    }

}

$router = new \controllers\classes\Router();

//Routes for views
$router->newRoute('/', 'Views@Home');
$router->newRoute('/about', 'Views@About');
$router->newRoute('/login', 'Views@Login');
$router->newRoute('/workers', 'Views@Workers');
$router->newRoute('/workers/:uuid', 'Views@EditWorkers');
$router->newRoute('/drivers', 'Views@Drivers');
$router->newRoute('/drivers/:uuid', 'Views@EditDriver');
$router->newRoute('/sales', 'Views@Sales');
$router->newRoute('/driver-sale/:uuid', 'Views@DriverSale');
$router->newRoute('/profile', 'Views@Profile');
$router->newRoute('/add-sale', 'Views@AddSales');
$router->newRoute('/salaries', 'Views@Salaries');
$router->newRoute('/worker-salary/:uuid', 'Views@WorkerSalary');
$router->newRoute('/settings', 'Views@Settings');
$router->newRoute('/expenses', 'Views@Workshop');
$router->newRoute('/vehicles', 'Views@Vehicles');
$router->newRoute('/inventories', 'Views@Inventories');
$router->newRoute('/add-inventory', 'Views@AddInventories');
$router->newRoute('/inventories/:uuid', 'Views@EditInventories');
$router->newRoute('/add-expense', 'Views@AddWorkshop');
$router->newRoute('/pay-worker', 'Views@PayWorker');
$router->newRoute('/pay-driver', 'Views@PayDriver');
$router->newRoute('/bank-deposit', 'Views@BankDeposit');
$router->newRoute('/bank-withdraw', 'Views@BankWithdraw');
$router->newRoute('/bank-transactions', 'Views@BankTransactions');

$router->newRoute('/vehicles/:uuid', 'Views@EditVehicles');

//Routes for AJAX
$router->newRoute('/installation', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/installer.Ajax.php';
});

$router->newRoute('/logout', function(){
    $logIn = new Login;
    $logIn->logUserOut();
});

$router->newRoute('/api/login', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/login.Ajax.php';
});

$router->newRoute('/api/workers', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/workers.Ajax.php';
});

$router->newRoute('/api/add-worker', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/addWorker.Ajax.php';
});

$router->newRoute('/api/add-driver', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/addDriver.Ajax.php';
});

$router->newRoute('/api/drivers', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/drivers.Ajax.php';
});

$router->newRoute('/api/sales', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/sales.Ajax.php';
});

$router->newRoute('/api/sales/:uuid', function($params){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/sales.Ajax.php';
});

$router->newRoute('/api/salaries', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/salary.Ajax.php';
});

$router->newRoute('/api/salaries/:uuid', function($params){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/salary.Ajax.php';
});

$router->newRoute('/api/bank', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/bank.Ajax.php';
});

$router->newRoute('/api/totals', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/totals.Ajax.php';
});

$router->newRoute('/api/settings', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/settings.Ajax.php';
});

$router->newRoute('/api/profile', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/profile.Ajax.php';
});

$router->newRoute('/api/workshop', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/workshop.Ajax.php';
});

$router->newRoute('/api/inventory', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/inventory.Ajax.php';
});

$router->newRoute('/api/vehicles', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/vehicles.Ajax.php';
});

$router->newRoute('/api/vehicles/:uuid', function($params){
    Vehicles::$vehicleId = $params[0];
    $vehicle = Vehicles::getVehicle();
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/vehicles.Ajax.php';
});

$router->run();