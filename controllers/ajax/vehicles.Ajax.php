<?php 
    if(isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) && isset($_COOKIE['userUuid'])){
        if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'){
            CheckUser::$userUuid = $_SESSION['userUuid'];
            CheckUser::checkUserAvailable();
            if(CheckUser::$userAvailable === true){
                if($_SERVER['REQUEST_METHOD'] === 'POST'){
                    if($_POST['method'] === 'POST'){
                        $isEmptyField = false;

                        foreach($_POST as $post){
                            if(empty($post)){
                                $isEmptyField = true;
                            }
                        }

                        if($isEmptyField){
                            RequestError::error("Some of the fields are empty!");
                        }else{
                            if(!isset($_FILES['photo']['name']) || empty($_FILES['photo']['name'])){
                                Vehicles::$photo = 'vehicle.png';
                            }else{
                                Vehicles::$photo = basename($_FILES['photo']['name']).time().'.jpg';
                                $imgTmp = $_FILES['photo']['tmp_name'];
                                if(!is_dir($_SERVER['DOCUMENT_ROOT'].'/uploads/vehicles')){
                                    mkdir($_SERVER['DOCUMENT_ROOT'].'/uploads/vehicles', 0777, true);
                                    move_uploaded_file($imgTmp, $_SERVER['DOCUMENT_ROOT'].'/uploads/vehicles/'.Vehicles::$photo);
                                }else {
                                    move_uploaded_file($imgTmp, $_SERVER['DOCUMENT_ROOT'].'/uploads/vehicles/'.Vehicles::$photo);
                                }
                                
                            }
                            Vehicles::$model = $_POST['model'];
                            Vehicles::$regisNumber = $_POST['regisNo'];
                            Vehicles::$type = $_POST['type'];
                            Vehicles::$color = $_POST['color'];
                            Vehicles::$engineNo = $_POST['engine'];
                            Vehicles::$trans = $_POST['trans'];
                            Vehicles::$axle = $_POST['axle'];
                            Vehicles::$paint = $_POST['paint'];
                            Vehicles::$trim = $_POST['trim'];
                            Vehicles::$chasis = $_POST['chasis'];
                            Vehicles::$converted = $_POST['converted'];
                            Vehicles::$drivenBy = $_POST['drivenBy'];
                            Vehicles::$other = $_POST['other'];

                            Vehicles::addVehicle();

                        }
                    }else if($_POST['method'] === 'GET'){
                        Vehicles::$vehicleId = isset($_POST['vehicleId']) ? $_POST['vehicleId'] : $params[0];
                        echo json_encode(Vehicles::getVehicle(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                    }elseif ($_POST['method'] === 'DELETE') {
                        Vehicles::$vehicleId = isset($_POST['vehicleId']) ? $_POST['vehicleId'] : $params[0];
                        Vehicles::deleteVehicle();
                    }elseif ($_POST['method'] === 'UPDATE') {
                        Vehicles::$vehicleId = $params[0];
                        $isEmptyField = false;

                        foreach($_POST as $post){
                            if(empty($post)){
                                $isEmptyField = true;
                            }
                        }

                        if($isEmptyField){
                            RequestError::error("Some of the fields are empty!");
                        }else{
                            if(!isset($_FILES['photo']['name']) || empty($_FILES['photo']['name'])){
                                Vehicles::$photo = $vehicle['data']['photo'];
                            }else{
                                Vehicles::$photo = basename($_FILES['photo']['name']).time().'.jpg';
                                $imgTmp = $_FILES['photo']['tmp_name'];
                                if(!is_dir($_SERVER['DOCUMENT_ROOT'].'/uploads/vehicles')){
                                    mkdir($_SERVER['DOCUMENT_ROOT'].'/uploads/vehicles', 0777, true);
                                    move_uploaded_file($imgTmp, $_SERVER['DOCUMENT_ROOT'].'/uploads/vehicles/'.Vehicles::$photo);
                                }else {
                                    move_uploaded_file($imgTmp, $_SERVER['DOCUMENT_ROOT'].'/uploads/vehicles/'.Vehicles::$photo);
                                }
                                
                            }
                            Vehicles::$currentRegisNumber = $vehicle['data']['regisNumber'];

                            Vehicles::$model = $_POST['model'];
                            Vehicles::$regisNumber = $_POST['regisNo'];
                            Vehicles::$type = $_POST['type'];
                            Vehicles::$color = $_POST['color'];
                            Vehicles::$engineNo = $_POST['engine'];
                            Vehicles::$trans = $_POST['trans'];
                            Vehicles::$axle = $_POST['axle'];
                            Vehicles::$paint = $_POST['paint'];
                            Vehicles::$trim = $_POST['trim'];
                            Vehicles::$chasis = $_POST['chasis'];
                            Vehicles::$converted = $_POST['converted'];
                            Vehicles::$drivenBy = $_POST['drivenBy'];
                            Vehicles::$other = $_POST['other'];

                            Vehicles::updateVehicle();
                        }
                    }
                }else if($_SERVER['REQUEST_METHOD'] === 'GET'){
                    Vehicles::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                    Vehicles::getVehicles();
                }
            }else{
                RequestError::error("Redirect");

            }
        }else{
            RequestError::error("Forbidden");
        }
    }else{
        RequestError::error("Redirect");

    }