<?php 
    if(isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) && isset($_COOKIE['userUuid'])){
        CheckUser::$userUuid = $_SESSION['userUuid'];
        CheckUser::checkUserAvailable();
        if(CheckUser::$userAvailable === true && $_SERVER['REQUEST_METHOD'] === 'POST'){
            if($_SESSION['userRole'] === 'superAdmin'){
                if(empty($_POST['siteName'])){
                    RequestError::error("Website Name shouldn't be empty!");
                    return;
                }
                if(!isset($_FILES['logo']['name']) || empty($_FILES['logo']['name'])){
                    Settings::$newLogo = Settings::$getLogo;
                }else{
                    Settings::$newLogo = basename($_FILES['logo']['name']);
                    $imgTmp = $_FILES['logo']['tmp_name'];

                    if(!is_dir($_SERVER['DOCUMENT_ROOT'].'/uploads/logos')){
                        mkdir($_SERVER['DOCUMENT_ROOT'].'/uploads/logos', 0777, true);
                        move_uploaded_file($imgTmp, $_SERVER['DOCUMENT_ROOT'].'/uploads/logos/'.Settings::$newLogo);
                    }else {
                        move_uploaded_file($imgTmp, $_SERVER['DOCUMENT_ROOT'].'/uploads/logos/'.Settings::$newLogo);
                    }
                }
                Settings::$newSiteName = $_POST['siteName'];
                Settings::updateSettings();
            }
        }else{
            RequestError::error("Redirect");

        }
}else{
    RequestError::error("Redirect");

}