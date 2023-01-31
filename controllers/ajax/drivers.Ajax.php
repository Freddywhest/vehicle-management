<?php 
    if(isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) && isset($_COOKIE['userUuid'])){
        if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'){
            CheckUser::$userUuid = $_SESSION['userUuid'];
            CheckUser::checkUserAvailable();
            if(CheckUser::$userAvailable === true){
                if($_SERVER['REQUEST_METHOD'] === 'GET'){
                    if(isset($_GET['search']) && trim($_GET['search']) !== '' && $_GET['search'] !== NULL){
                        Driver::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                        Driver::searchDrivers($_GET['search']);;
                    }else{
                        Driver::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                        Driver::getDrivers();

                    }

                }else if($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['method'] === 'DELETE'){
                    if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'){
                        Driver::deleteDriver($_POST['driverId']);
                    }else{
                        echo json_encode([
                            "status" => false,
                            "message" => "You are not allowed to delete bank transaction!"
                        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
                    }
                }else if($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['method'] === 'UPDATE'){
                    Driver::$fullName = $_POST['fullName'];
                    Driver::$bateOfBirth = $_POST['DoB'];
                    Driver::$phoneHome = $_POST['phoneOne'];
                    Driver::$phoneMobile = $_POST['phoneTwo'];
                    Driver::$idNumber = $_POST['idNumber'];
                    Driver::$email = $_POST['driverEmail'];
                    Driver::$curAddress = $_POST['curAddress'].'|'.$_POST['curFrom'].'|'.$_POST['curTo'];
                    Driver::$prevAddress = isset($_POST['prevOne'], $_POST['prevTwo'], $_POST['prevThree']) && !empty($_POST['prevOne']) && !empty($_POST['prevTwo']) && !empty($_POST['prevThree'])  ? $_POST['prevOne'].'|'.$_POST['prevTwo'].'|'.$_POST['prevThree'] : NULL;
                    Driver::$prevCity = isset($_POST['prevTo1'], $_POST['prevTo2'], $_POST['prevTo3']) && !empty($_POST['prevTo1']) && !empty($_POST['prevTo2']) && !empty($_POST['prevTo3']) ? $_POST['prevTo1'].'|'.$_POST['prevTo2'].'|'.$_POST['prevTo3'] : NULL;
                    Driver::$prevRegion = isset($_POST['prevFrom1'], $_POST['prevFrom2'], $_POST['prevFrom3']) && !empty($_POST['prevFrom1']) && !empty($_POST['prevFrom2']) && !empty($_POST['prevFrom3'])  ? $_POST['prevFrom1'].'|'.$_POST['prevFrom2'].'|'.$_POST['prevFrom3'] : NULL;
                    Driver::$emergence = $_POST['notifyName'].'|'.$_POST['nContact'];
                    Driver::$crime = $_POST['convictedRadio'];
                    Driver::$position = $_POST['position'];
                    Driver::$salary = $_POST['salary'];
                    Driver::$workedInCompany = isset($_POST['prevFromWorked'], $_POST['prevToWorked']) && !empty($_POST['prevFromWorked']) && !empty($_POST['prevToWorked']) ? $_POST['prevFromWorked'].'|'.$_POST['prevToWorked'] : NULL;
                    Driver::$preventedLawful = $_POST['preventedRadio'];
                    Driver::$convictedFelony = $_POST['convictedRadio'];
                    Driver::$drivingLicense = isset($_POST['lNumber'], $_POST['lCity'], $_POST['lExpDate'], $_POST['lType']) && !empty($_POST['lNumber']) && !empty($_POST['lCity']) && !empty($_POST['lExpDate']) && !empty($_POST['lType']) ? $_POST['lNumber'].'|'.$_POST['lCity'].'|'.$_POST['lExpDate'].'|'.$_POST['lType'] : NULL;
                    Driver::$highestEdu = $_POST['hEdu'].'|'.$_POST['compOn'];
                    Driver::$fullKnowledge = $_POST['carreerRadio'];
                    Driver::$expTractor = isset($_POST['tractorEquipType'], $_POST['tractorYears'], $_POST['tractorStates']) && !empty($_POST['tractorEquipType']) && !empty($_POST['tractorYears']) && !empty($_POST['tractorStates'])  ? $_POST['tractorEquipType'].'|'.$_POST['tractorYears'].'|'.$_POST['tractorStates'] : NULL;

                    Driver::$expTruck = isset($_POST['truckEquipType'], $_POST['truckYears'], $_POST['truckStates']) && !empty($_POST['truckEquipType']) && !empty($_POST['truckYears']) && !empty($_POST['truckStates'])  ? $_POST['truckEquipType'].'|'.$_POST['truckYears'].'|'.$_POST['truckStates'] : NULL;

                    Driver::$expTrailer = isset($_POST['trailerEquipType'], $_POST['trailerYears'], $_POST['trailerStates']) && !empty($_POST['trailerEquipType']) && !empty($_POST['trailerYears']) && !empty($_POST['trailerStates'])  ? $_POST['trailerEquipType'].'|'.$_POST['trailerYears'].'|'.$_POST['trailerStates'] : NULL;

                    Driver::$expBus = isset($_POST['busEquipType'], $_POST['busYears'], $_POST['busStates']) && !empty($_POST['busEquipType']) && !empty($_POST['busYears']) && !empty($_POST['busStates'])  ? $_POST['busEquipType'].'|'.$_POST['busYears'].'|'.$_POST['busStates'] : NULL;

                    Driver::$expVan = isset($_POST['vanEquipType'], $_POST['vanYears'], $_POST['vanStates']) && !empty($_POST['vanEquipType']) && !empty($_POST['vanYears']) && !empty($_POST['vanStates'])  ? $_POST['vanEquipType'].'|'.$_POST['vanYears'].'|'.$_POST['vanStates'] : NULL;

                    Driver::$expTaxi = isset($_POST['taxiEquipType'], $_POST['taxiYears'], $_POST['taxiStates']) && !empty($_POST['taxiEquipType']) && !empty($_POST['taxiYears']) && !empty($_POST['taxiStates'])  ? $_POST['taxiEquipType'].'|'.$_POST['taxiYears'].'|'.$_POST['taxiStates'] : NULL;

                    Driver::$accidentRecord = isset($_POST['dateAccidentNature'], $_POST['accidentNature'], $_POST['fatalities'], $_POST['injuries']) && !empty($_POST['dateAccidentNature']) && !empty($_POST['accidentNature']) && !empty($_POST['injuries']) && !empty($_POST['fatalities'])  ? $_POST['dateAccidentNature'].'|'.$_POST['accidentNature'].'|'.$_POST['fatalities'].'|'.$_POST['injuries'] : NULL;

                    Driver::$traffic = isset($_POST['dateViolation'], $_POST['violation'], $_POST['state'], $_POST['penalty']) && !empty($_POST['dateViolation']) && !empty($_POST['state']) && !empty($_POST['violation']) && !empty($_POST['penalty'])  ? $_POST['dateViolation'].'|'.$_POST['violation'].'|'.$_POST['state'].'|'.$_POST['penalty'] : NULL;

                    $driverPhoto = isset($_FILES['driverPhoto']['name']) ? $_FILES['driverPhoto']['name'] : NULL;

                if(!empty(Driver::$fullName) && !empty(Driver::$phoneHome) && !empty(Driver::$bateOfBirth) && !empty(Driver::$idNumber)){
                    if($driverPhoto !== NULL){
                        Driver::$photo = $driverPhoto.time().'.jpg';
                        $driverPhotoTmp = $_FILES['driverPhoto']['tmp_name'];
        
                        if(!is_dir($_SERVER['DOCUMENT_ROOT'].'/uploads/drivers')){
                            mkdir($_SERVER['DOCUMENT_ROOT'].'/uploads/drivers', 0777, true);
                            move_uploaded_file($driverPhotoTmp, $_SERVER['DOCUMENT_ROOT'].'/uploads/drivers/'.Driver::$photo);
                        }else {
                            move_uploaded_file($driverPhotoTmp, $_SERVER['DOCUMENT_ROOT'].'/uploads/drivers/'.Driver::$photo);
                        }
                    }else{
                            $driver = Driver::getADriver($_GET['did']);
                            Driver::$photo = $driver['data']['driverPhoto'];
            
                    }
                        Driver::$driverId = $_GET['did'];
                        Driver::updateDriver();
                        echo json_encode([
                            "status" => true,
                            "message" => "driver successfully updated! "
                        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

                    }else{
                        echo json_encode([
                            "status" => false,
                            "message" => "Some of the fields are empty!"
                        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            
                    }
                }else if($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['method'] === 'GET'){
                    Driver::$driverId = $_POST['driverId'];
                    Driver::getDriver();
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
                "message" => "Forbidden!"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }
}else{
    echo json_encode([
        "status" => false,
        "message" => "Redirect"
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

}