<?php 
    if(isset($_POST['userEmail'])){
        $userEmail = $_POST['userEmail'];
        $userPassword = $_POST['userPassword'];
        if(empty($userEmail)){
            echo json_encode([
                "status" => false,
                "message" => "Email shouldn't be empty!"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }else if(empty($userPassword)){
            echo json_encode([
                "status" => false,
                "message" => "Password shouldn't be empty!"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }else{
            $loginClass = new Login();
            $loginClass->userEmail = htmlspecialchars($userEmail);
            $loginClass->userPass = htmlspecialchars($userPassword);
            $loginClass->logUserIn();
        }
    }else{
        echo json_encode([
            "status" => false,
            "message" => "Something went wrong, Please refresh the page and try again!"
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }