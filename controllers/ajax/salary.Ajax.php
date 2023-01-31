<?php 
    if(isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) && isset($_COOKIE['userUuid'])){
        CheckUser::$userUuid = $_SESSION['userUuid'];
        CheckUser::checkUserAvailable();
            if(CheckUser::$userAvailable === true){
                if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'){
                header('Content-Type: application/json; charset=utf-8');
                if($_SERVER['REQUEST_METHOD'] === 'GET'){
                    if($_GET['method'] === 'allDrivers'){
                        Salary::allDrivers();
                    }else if($_GET['method'] === 'allWorkers'){
                        Salary::allWorkers();
                    }else if($_GET['method'] === 'allSalaries'){
                        Salary::$filter = isset($_GET['filter']) ? $_GET['filter'] : 'all';
                        Salary::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                        Salary::getSalary();
                        new Salary();

                    }else if($_GET['method'] === 'workerSalaries'){
                        Salary::$filter = isset($_GET['filter']) ? $_GET['filter'] : 'all';
                        Salary::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                        Salary::getSalaryByUser($params[0]);

                    }
                }elseif($_SERVER['REQUEST_METHOD'] === 'POST'){
                    if($_POST['method'] === 'POST'){
                        if($_POST['type'] === 'PayToAllWorkers'){
                            Salary::payWorkers();
                        }else if($_POST['type'] === 'PayToWorker'){
                            if(empty($_POST['amount']) || empty($_POST['receiverId'])){
                                RequestError::error("Salary amount or worker shouldn't be empty!");
                                return;
                            }
                            Salary::$amount = $_POST['amount'];
                            Salary::$receiverId = $_POST['receiverId'];
                            Salary::payWorker();

                        }else if($_POST['type'] === 'PayToAllDrivers'){
                            Salary::payDrivers();
                        }else if($_POST['type'] === 'PayToDriver'){
                            if(empty($_POST['amount']) || empty($_POST['receiverId'])){
                                RequestError::error("Salary amount or worker shouldn't be empty!");
                                return;
                            }
                            Salary::$amount = $_POST['amount'];
                            Salary::$receiverId = $_POST['receiverId'];
                            Salary::payDriver();
                        }
                    }else if($_POST['method'] === 'DELETE'){
                        if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'){
                            Salary::$salaryId = $_POST['salaryId'];
                            Salary::deleteSalary();
                        }else{
                            RequestError::error("You are not allowed to delete sales!");
                        }
                    }
                }
            }else{
                RequestError::error("You are not allowed to perform this action!");
            }
        }else{
            RequestError::error("Redirect");

        }
}else{
    RequestError::error("Redirect");

}