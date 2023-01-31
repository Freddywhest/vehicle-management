<?php
declare(strict_types = 1);
if(class_exists('Installer')){
    
    if(isset($_POST['install'])){
       $dbUser  = (string) $_POST['dbUser'];
       $dbHost = (string) $_POST['dbHost'];
       $dbPass = (string) $_POST['dbPass'];
       $dbName = (string) $_POST['dbName'];
       $userName = (string) $_POST['userName'];
       $userPass = (string) $_POST['userPass'];
       $conUserPass = (string) $_POST['conUserPass'];
       $userEmail = (string) $_POST['userEmail'];
       $siteName = (string) $_POST['siteName'];
       $siteLogo = isset($_FILES['siteLogo']['name']) ? $_FILES['siteLogo']['name'] :NULL;

       if(empty($dbUser)){
           $status = false;
           $message = "Please enter your database user!";

       }else if(empty($dbHost)){
           $status = false;
           $message = "Please enter your database host!";

       }else if(empty($dbName)){
           $status = false;
           $message = "Please enter your database name!";

       }else if(empty($userName)){
           $status = false;
           $message = "Please enter your full name!";

       }else if(empty($userEmail)){
           $status = false;
           $message = "Please enter your email!";

       }else if(!filter_var($userEmail, FILTER_VALIDATE_EMAIL)){
           $status = false;
           $message = "Please enter a valid email!";

       }else if(empty($userPass)){
           $status = false;
           $message = "Please enter your password!";

       }else if(strlen($userPass) < 8){
           $status = false;
           $message = "Your password shouldn't be less than 8!";

       }else if(empty($conUserPass)){
           $status = false;
           $message = "Confirm password shouldn't be empty!";

       }else if($conUserPass !== $userPass){
           $status = false;
           $message = "Your password and confirm password should be the same!";

       }else if(empty($siteName)){
           $status = false;
           $message = "Please enter the website name!";

       }else if(empty($siteLogo) || !isset($siteLogo)){
           $status = false;
           $message = "Please add website logo!";


       }else{
           $siteLogo_tmp = $_FILES['siteLogo']['tmp_name'];
   
           if(!is_dir($_SERVER['DOCUMENT_ROOT'].'/uploads/logos')){
               mkdir($_SERVER['DOCUMENT_ROOT'].'/uploads/logos', 0777, true);
               move_uploaded_file($siteLogo_tmp, $_SERVER['DOCUMENT_ROOT'].'/uploads/logos/'.$siteLogo);
           }else {
               move_uploaded_file($siteLogo_tmp, $_SERVER['DOCUMENT_ROOT'].'/uploads/logos/'.$siteLogo);
           }
           Installer::$dbUser = htmlspecialchars($dbUser);
           Installer::$dbHost = htmlspecialchars($dbHost);
           Installer::$dbPass = $dbPass;
           Installer::$dbName = htmlspecialchars($dbName);
           new Installer();
           Installer::installDataBase();
           
           Models::$userName = htmlspecialchars($userName);
           Models::$userPass = $userPass;
           Models::$userEmail = $userEmail;
           Models::$siteLogo = $siteLogo ;
           Models::$siteName = htmlspecialchars($siteName);
           new Models();
           
           Models::users();
           Models::drivers();
           Models::vehicles();
           Models::sales();
           Models::bank();
           Models::salary();
           Models::inventory();
           Models::workShop();
           Models::websiteSettings();
           Models::addUser();
           Models::addWebsite();


           $status = true;
           $message = "Installation in process, please wait........";

       }
       
   }else{
    $status = false;
    $message = "Bad request, Please try again!";

   } 
}else{
    $status = false;
    $message = "The website scripts are not complete or some of the files are missing! <br /> Contact the creator for help on <b>Email: alfrednti466@gmail.com</b>.";
}
header('Content-Type: application/json; charset=utf-8');

echo json_encode([
    'status' => $status,
    'message' => $message
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

   