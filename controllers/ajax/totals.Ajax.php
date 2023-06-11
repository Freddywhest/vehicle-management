<?php 
    if(isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) && isset($_COOKIE['userUuid'])){
        CheckUser::$userUuid = $_SESSION['userUuid'];
        
        header('Content-Type: application/json; charset=utf-8');
        CheckUser::checkUserAvailable();
            if(CheckUser::$userAvailable === true){
                if($_SERVER['REQUEST_METHOD'] === 'GET'){
                    if(isset($_GET['filter'])){
                        Totals::$filter = $_GET['filter'];
                        RequestError::singleArray(Totals::totalSalesFilter());
                        return;
                    }elseif(isset($_GET['filterDate'])){
                        Totals::$filterDate = $_GET['filterDate'];
                        RequestError::singleArray(Totals::totalDailtySalesFilter());
                    }else{
                        if(isset($_GET['type']) && $_GET['type'] === 'bank'){
                            RequestError::singleArray(Totals::bankBalance());
                        }else if(isset($_GET['type']) && $_GET['type'] === 'all'){
                            RequestError::singleArray(Totals::allTotals());
                        }else if(isset($_GET['type']) && $_GET['type'] === 'expenses'){
                            RequestError::singleArray(Totals::totalExpenses());
                            
                        }
                        
                    }
                }
            }else{
            RequestError::error("Redirect");

        }
}else{
    RequestError::error("Redirect");

}