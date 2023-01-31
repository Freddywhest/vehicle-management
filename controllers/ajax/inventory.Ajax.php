<?php 
    if(isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) && isset($_COOKIE['userUuid'])){
        CheckUser::$userUuid = $_SESSION['userUuid'];
        CheckUser::checkUserAvailable();
            if(CheckUser::$userAvailable === true){
                if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'){
                header('Content-Type: application/json; charset=utf-8');
                if($_SERVER['REQUEST_METHOD'] === 'GET'){
                    if(isset($_GET['search']) && trim($_GET['search']) !== '' && $_GET['search'] !== NULL){
                        Inventory::$filter = isset($_GET['filter']) ? trim($_GET['filter']) : 'all';
                        Inventory::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                        Inventory::searchInventories(trim($_GET['search']));
                    }else{
                        Inventory::$filter = isset($_GET['filter']) ? trim($_GET['filter']) : 'all';
                        Inventory::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                        Inventory::getInventories();

                    }

                }elseif($_SERVER['REQUEST_METHOD'] === 'POST'){
                    if($_POST['method'] === 'POST'){
                        if(empty($_POST['inventoryName']) && empty($_POST['vehicleBrand']) && empty($_POST['inventoryCondition']) && empty($_POST['quantity'])){
                            RequestError::error("Some of the fields is empty!");
                            return;
                        }
                        Inventory::$inventoryName = $_POST['inventoryName'];
                        Inventory::$vehicleBrand = $_POST['vehicleBrand'];
                        Inventory::$inventoryCondition = $_POST['inventoryCondition'];
                        Inventory::$quantity = $_POST['quantity'];

                        if(!isset($_FILES['photo']['name']) || empty($_FILES['photo']['name'])){
                            Inventory::$photo = 'inventory.png';
                        }else{
                            Inventory::$photo = basename($_FILES['photo']['name']).time().'.jpg';
                            $imgTmp = $_FILES['photo']['tmp_name'];
                            if(!is_dir($_SERVER['DOCUMENT_ROOT'].'/uploads/inventory')){
                                mkdir($_SERVER['DOCUMENT_ROOT'].'/uploads/inventory', 0777, true);
                                move_uploaded_file($imgTmp, $_SERVER['DOCUMENT_ROOT'].'/uploads/inventory/'.Inventory::$photo);
                            }else {
                                move_uploaded_file($imgTmp, $_SERVER['DOCUMENT_ROOT'].'/uploads/inventory/'.Inventory::$photo);
                            }
                            
                        }

                        Inventory::addInventory();
                    }else if($_POST['method'] === 'QUANTITY'){
                        Inventory::$quantity = (int) $_POST['quantity'] < 0 ? 0 : $_POST['quantity'];
                        Inventory::$inventoryId = $_POST['inventoryId'];
                        Inventory::updateQty();
                    }else if($_POST['method'] === 'GET'){
                        echo json_encode(Inventory::getInventory($_POST['inventoryId']));

                    }else if($_POST['method'] === 'UPDATE'){
                        Inventory::$inventoryName = $_POST['inventoryName'];
                        Inventory::$vehicleBrand = $_POST['vehicleBrand'];
                        Inventory::$inventoryCondition = $_POST['inventoryCondition'];
                        Inventory::$quantity = $_POST['quantity'];

                        if(!isset($_FILES['photo']['name']) || empty($_FILES['photo']['name'])){
                            Inventory::$photo = Inventory::getInventory($_POST['inventoryId'])['data']['photo'];
                        }else{
                            Inventory::$photo = basename($_FILES['photo']['name']).time().'.jpg';
                            $imgTmp = $_FILES['photo']['tmp_name'];
                            if(!is_dir($_SERVER['DOCUMENT_ROOT'].'/uploads/inventory')){
                                mkdir($_SERVER['DOCUMENT_ROOT'].'/uploads/inventory', 0777, true);
                                move_uploaded_file($imgTmp, $_SERVER['DOCUMENT_ROOT'].'/uploads/inventory/'.Inventory::$photo);
                            }else {
                                move_uploaded_file($imgTmp, $_SERVER['DOCUMENT_ROOT'].'/uploads/inventory/'.Inventory::$photo);
                            }
                            
                        }

                        Inventory::$inventoryId = $_POST['inventoryId'];
                        Inventory::updateInventory();

                    }else if($_POST['method'] === 'DELETE'){
                        if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'){
                            Inventory::$inventoryId = $_POST['inventoryId'];
                            Inventory::deleteInventory();
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