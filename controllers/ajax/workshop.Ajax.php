<?php 
    if(isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) && isset($_COOKIE['userUuid'])){
        if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'){
            CheckUser::$userUuid = $_SESSION['userUuid'];
            CheckUser::checkUserAvailable();
            if(CheckUser::$userAvailable === true){
                header('Content-Type: application/json; charset=utf-8');
                if($_SERVER['REQUEST_METHOD'] == 'POST'){
                    if(isset($_POST['type']) && $_POST['type'] === 'POST'){
                        if(!empty($_POST['amount']) && !empty($_POST['purpose'])){
                            Workshop::$amount = $_POST['amount'];
                            Workshop::$purpose = $_POST['purpose'];
                            Workshop::$workshopN = $_POST['workshopN'];
                            Workshop::$workshopC = $_POST['workshopC'];
                            Workshop::addWorkshop();
                        }else{
                            RequestError::error("Expense amount or purpose shouldn't be empty!");
                        }
                    }else if(isset($_POST['type']) && $_POST['type'] === 'expense'){
                        if(isset($_POST['workshopId'])){
                            Workshop::$workshopId = $_POST['workshopId'];
                            Workshop::getExpense();
                        }else{
                            RequestError::error("Something went wrong!");
                        }
                    }else if(isset($_POST['type']) && $_POST['type'] === 'DELETE'){
                        if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'){
                            Workshop::$workshopId = $_POST['workshopId'];
                            Workshop::deleteWorkshop();
                        }else{
                            echo json_encode([
                                "status" => false,
                                "message" => "You are not allowed to delete expense transaction!"
                            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
                        }
                    }else{
                        RequestError::error("Bad Request!");
                    }
                }else if($_SERVER['REQUEST_METHOD'] === 'GET'){
                    if(isset($_GET['type']) && $_GET['type'] === 'expenses'){
                        Workshop::$filter = isset($_GET['filter']) && $_GET['filter'] === 'today' ? 'today' : 'all';
                        Workshop::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                        Workshop::getWorkshop();

                    }
                }else{
                    RequestError::error("Bad Request");
                }
            }else{
                RequestError::error("Redirect");

            }
        }else{
            RequestError::error("Forbidden!");
        }
}else{
    RequestError::error("Redirect");

}