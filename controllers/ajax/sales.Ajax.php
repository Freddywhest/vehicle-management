<?php 
    if(isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) && isset($_COOKIE['userUuid'])){
        CheckUser::$userUuid = $_SESSION['userUuid'];
        CheckUser::checkUserAvailable();
        if(CheckUser::$userAvailable === true){
            if($_SERVER['REQUEST_METHOD'] === 'GET'){
                if(isset($_GET['method']) && $_GET['method'] === 'driverSale'){
                    Sales::$filter = isset($_GET['filter']) && $_GET['filter'] === 'today' ? 'today' : 'all';
                    header('Content-Type: application/json; charset=utf-8');
                    Sales::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                    Sales::getSalesByDriver($params[0]);
                }else{
                    Sales::$filter = isset($_GET['filter']) && $_GET['filter'] === 'today' ? 'today' : 'all';
                    header('Content-Type: application/json; charset=utf-8');
                    Sales::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                    if($_SESSION['userRole'] === 'superAdmin' || $_SESSION['userRole'] === 'admin'){
                        Sales::getSales();
    
                    }else{
                        Sales::getSalesByUser();
                    }

                }
            }elseif($_SERVER['REQUEST_METHOD'] === 'POST'){
                if($_POST['method'] === 'POST'){
                    if(empty($_POST['driver'])){
                        RequestError::error("Driver's Identity Number shouldn't be empty!");
                        return;
                    }
                    if($_POST['status'] === 'check'){
                    Sales::$driver = $_POST['driver'];
                        Sales::checkDriver();
                    }else if($_POST['status'] === 'valid'){
                        Sales::$amount = $_POST['amount'];
                        if(empty($_POST['amount'])){
                            RequestError::error("Sales amount shouldn't be empty!");
                            return;
                        }
                        Sales::$driver = $_POST['driver'];
                        Sales::addSale();
                    }
                }else if($_POST['method'] === 'DELETE'){
                    if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'){
                        Sales::$salesId = $_POST['salesId'];
                        Sales::deleteSale();
                    }else{
                        RequestError::error("You are not allowed to delete sales!");
                    }
                }
            }
        }else{
            RequestError::error("Redirect");

        }
}else{
    RequestError::error("Redirect");

}