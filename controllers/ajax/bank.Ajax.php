<?php 
    if(isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) && isset($_COOKIE['userUuid'])){
        CheckUser::$userUuid = $_SESSION['userUuid'];
        CheckUser::checkUserAvailable();
            if(CheckUser::$userAvailable === true){
                if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'){
                header('Content-Type: application/json; charset=utf-8');
                if($_SERVER['REQUEST_METHOD'] === 'GET'){
                    Bank::$filter = isset($_GET['filter']) ? $_GET['filter'] : 'all';
                    Bank::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                    Bank::getBank();
                    new Salary();

                }elseif($_SERVER['REQUEST_METHOD'] === 'POST'){
                    if($_POST['method'] === 'POST'){
                        if($_POST['type'] === 'deposit'){
                            if(empty($_POST['amount'])){
                                echo json_encode([
                                    "status" => false,
                                    "message" => "Amount shouldn't be empty!"
                                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
                                return;
                            }
                            Bank::$amount = $_POST['amount'];
                            Bank::$recordedBy = $_SESSION['userUuid'];
                            Bank::deposit();

                        }else if($_POST['type'] === 'withdraw'){
                            if(empty($_POST['amount']) || empty($_POST['purpose'])){
                                echo json_encode([
                                    "status" => false,
                                    "message" => "Amount or purpose shouldn't be empty!"
                                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
                                return;
                            }
                            Bank::$amount = $_POST['amount'];
                            Bank::$purpose = $_POST['purpose'];
                            Bank::$recordedBy = $_SESSION['userUuid'];
                            Bank::withdraw();
                        }
                    }else if($_POST['method'] === 'GET'){
                        Bank::$bankId = $_POST['bankId'];
                        Bank::getBankDetails();
                    }else if($_POST['method'] === 'DELETE'){
                        if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'){
                            Bank::$bankId = $_POST['bankId'];
                            Bank::deleteBank();
                        }else{
                            echo json_encode([
                                "status" => false,
                                "message" => "You are not allowed to delete bank transaction!"
                            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
                        }
                    }
                }
            }else{
                echo json_encode([
                    "status" => false,
                    "message" => "You are not allowed to perform this action!"
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            }
        }else{
            echo json_encode([
                "status" => false,
                "message" => "Redirect"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }
}else{
    echo json_encode([
        "status" => false,
        "message" => "Redirect"
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

}