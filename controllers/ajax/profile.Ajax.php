<?php 
    if(isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) && isset($_COOKIE['userUuid'])){
        CheckUser::$userUuid = $_SESSION['userUuid'];
        CheckUser::checkUserAvailable();
        if(CheckUser::$userAvailable === true){
            if($_SERVER['REQUEST_METHOD'] === 'POST'){
                if($_POST['type'] === 'details'){
                    if(empty($_POST['fullName'])){
                        RequestError::error("Name shouldn't be empty!");
                        return;
                    }
                    LoginUser::$newFullName = $_POST['fullName'];
                    if(!isset($_FILES['photo']['name']) || empty($_FILES['photo']['name'])){
                        LoginUser::$newUserPhoto = LoginUser::getLoginUser()['photo'];
                    }else{
                        LoginUser::$newUserPhoto = basename($_FILES['photo']['name']).time().'.jpg';
                        $imgTmp = $_FILES['photo']['tmp_name'];
    
                        if(!is_dir($_SERVER['DOCUMENT_ROOT'].'/uploads/users')){
                            mkdir($_SERVER['DOCUMENT_ROOT'].'/uploads/users', 0777, true);
                            move_uploaded_file($imgTmp, $_SERVER['DOCUMENT_ROOT'].'/uploads/users/'.LoginUser::$newUserPhoto);
                        }else {
                            move_uploaded_file($imgTmp, $_SERVER['DOCUMENT_ROOT'].'/uploads/users/'.LoginUser::$newUserPhoto);
                        }
                        
                    }

                    LoginUser::updateProfile();
                }else if($_POST['type'] === 'password') {
                    if(password_verify($_POST['curPass'], LoginUser::getLoginUser()['userPassword'])){
                        if(strlen($_POST['newPass']) > 7 ){
                            if($_POST['newPass'] === $_POST['conPass']){
                                Worker::$userUuid = $_SESSION['userUuid'];
                                Worker::$userPassword = $_POST['newPass'];
                                Worker::updatePassword(LoginUser::getLoginUser()['userDefaultPass']);
                            }else{
                                RequestError::error("New Password and Confirm New Password should be same!");
                            }

                        }else{
                            RequestError::error("Password shouldn't be less than 8 characters!");
                        }
                    }else{
                        RequestError::error("Current password is not correct!");
                    }
                }else if($_POST['type'] === 'setPassword') {
                    if(strlen($_POST['newPass']) > 7 ){
                        if($_POST['newPass'] === $_POST['conPass']){
                            Worker::$userUuid = $_SESSION['userUuid'];
                            Worker::$userPassword = $_POST['newPass'];
                            Worker::updatePassword('no');
                        }else{
                            RequestError::error("New Password and Confirm New Password should be same!");
                        }

                    }else{
                        RequestError::error("Password shouldn't be less than 8 characters!");
                    }
                }
            }else{
                RequestError::error("Bad Request");

            }
            
        }else{
            RequestError::error("Redirect");

        }
}else{
    RequestError::error("Redirect");

}