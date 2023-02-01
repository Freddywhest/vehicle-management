<?php 
    if(isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) && isset($_COOKIE['userUuid'])){
        if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'){
        if(isset($_POST['workerEmail'])){
            CheckUser::$userUuid = $_SESSION['userUuid'];
            CheckUser::checkUserAvailable();
            if(CheckUser::$userAvailable === true){
                $_POST['workerExpCompany'] = explode('~', $_POST['workerExpCompany']);
                $_POST['workerExpFrom'] = explode('~', $_POST['workerExpFrom']);
                $_POST['workerExpTo'] = explode('~', $_POST['workerExpTo']);
                $_POST['workerExpPosition'] = explode('~', $_POST['workerExpPosition']);
                $_POST['reasonLeaving'] = explode('~', $_POST['reasonLeaving']);
                $_POST['eduSchoolName'] = explode('~', $_POST['eduSchoolName']);
                $_POST['eduSchoolLocation'] = explode('~', $_POST['eduSchoolLocation']);
                $_POST['eduSchoolGrad'] = explode('~', $_POST['eduSchoolGrad']);
                $fullName = $_POST['fullName'];
                $DoB = $_POST['DoB'];
                $workerPhone1 = $_POST['workerPhone1'];
                $workerPhone2 = $_POST['workerPhone2'];
                $workerId = $_POST['workerId'];
                $workerEmail = $_POST['workerEmail'];
                $workerAddress = $_POST['workerAddress'];
                $workerCity = $_POST['workerCity'];
                $workerRegion = $_POST['workerRegion'];
                $crimeExplain = !empty($_POST['crimeExplain']) ? $_POST['crimeExplain'] : NULL;
                $workerEmpType = $_POST['workerEmpType'];
                $workerEmpPosition = $_POST['workerEmpPosition'];
                $workerEmpSalary = $_POST['workerEmpSalary'];
                $workerStartDate = $_POST['workerStartDate'];
                $workerExpCompany = !empty($_POST['workerExpCompany']) ? implode('|', $_POST['workerExpCompany']) : NULL;
                $workerExpFrom = !empty($_POST['workerExpFrom']) ? implode('|', $_POST['workerExpFrom']) : NULL;
                $workerExpTo = !empty($_POST['workerExpTo']) ? implode('|', $_POST['workerExpTo']) : NULL;
                $workerExpPosition = !empty($_POST['workerExpPosition']) ? implode('|', $_POST['workerExpPosition']) : NULL;
                $reasonLeaving = !empty($_POST['reasonLeaving']) ? implode('|', $_POST['reasonLeaving']) : NULL;
                $eduSchoolName = !empty($_POST['eduSchoolName']) ? implode('|', $_POST['eduSchoolName']) : NULL;
                $eduSchoolLocation = !empty($_POST['eduSchoolLocation']) ? implode('|', $_POST['eduSchoolLocation']) : NULL;
                $eduSchoolGrad = !empty($_POST['eduSchoolGrad']) ? implode('|', $_POST['eduSchoolGrad']) : NULL;
                $majorSkills = $_POST['majorSkills'];
                $userRole = $_POST['userRole'];
                $workerPhoto = isset($_FILES['workerPhoto']['name']) ? $_FILES['workerPhoto']['name'] :NULL;
                if(!empty($fullName) && !empty($workerEmail) && !empty($userRole) && !empty($userRole)){
                    if($workerPhoto !== NULL){
                        $workerPhotoName = $workerPhoto.time().'.jpg';
                    }else{
                        $workerPhotoName = 'avatar.png';
        
                    }
                    $userPassword = strtolower(explode(" ", $fullName)[0]);
                    Worker::$photo = $workerPhotoName;
                    Worker::$fullName = $fullName;
                    Worker::$DoB = $DoB;
                    Worker::$workerPhone1 = $workerPhone1;
                    Worker::$workerPhone2 = $workerPhone2;
                    Worker::$workerAddress = $workerAddress;
                    Worker::$workerId = $workerId;
                    Worker::$workerEmail = $workerEmail;
                    Worker::$workerCity = $workerCity;
                    Worker::$workerRegion = $workerRegion;
                    Worker::$crimeExplain = $crimeExplain;
                    Worker::$workerEmpType = $workerEmpType;
                    Worker::$workerEmpPosition = $workerEmpPosition;
                    Worker::$workerEmpSalary = $workerEmpSalary;
                    Worker::$workerStartDate = $workerStartDate;
                    Worker::$eduSchoolName = $eduSchoolName;
                    Worker::$eduSchoolLocation = $eduSchoolLocation;
                    Worker::$eduSchoolGrad = $eduSchoolGrad;
                    Worker::$workerExpCompany = $workerExpCompany;
                    Worker::$workerExpFrom = $workerExpFrom;
                    Worker::$workerExpTo = $workerExpTo;
                    Worker::$workerExpPosition = $workerExpPosition;
                    Worker::$reasonLeaving = $reasonLeaving;
                    Worker::$majorSkills = $majorSkills;
                    Worker::$userRole = $userRole;
                    Worker::$userPassword = $userPassword;
        
                    if(Worker::$userExist === true){
                        echo json_encode([
                            "status" => false,
                            "message" => "Email already exists!"
                        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
                    }else{
                        if($workerPhoto !== NULL){
                            $workerPhotoTmp = $_FILES['workerPhoto']['tmp_name'];
            
                            if(!is_dir($_SERVER['DOCUMENT_ROOT'].'/uploads/users')){
                                mkdir($_SERVER['DOCUMENT_ROOT'].'/uploads/users', 0777, true);
                                move_uploaded_file($workerPhotoTmp, $_SERVER['DOCUMENT_ROOT'].'/uploads/users/'.$workerPhotoName);
                            }else {
                                move_uploaded_file($workerPhotoTmp, $_SERVER['DOCUMENT_ROOT'].'/uploads/users/'.$workerPhotoName);
                            }
                            Worker::addWorker();
                        }
                        echo json_encode([
                            "status" => true,
                            "message" => "Worker successfully added!",
                            "Password" => $userPassword
                        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        
                    }
        
        
                }else{
                    echo json_encode([
                        "status" => false,
                        "message" => "Some of the fields are empty!"
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
                "message" => "Something went wrong, Please refresh the page and try again!"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }
    }else{
        echo json_encode([
            "status" => false,
            "message" => "Forbidden"
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }
}else{
    echo json_encode([
        "status" => false,
        "message" => "Redirect"
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

}