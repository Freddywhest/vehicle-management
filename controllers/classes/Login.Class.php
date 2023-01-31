<?php
declare(strict_types = 1);
    class Login extends DataBase{
        public string $userEmail;
        public string $userPass;
        private string $message;
        private bool $status;

        public function logUserIn():void{
            $checkUser = "SELECT userEmail, userPassword, userUuid, userRole FROM users WHERE userEmail =:email";
            $checkUserStmt = self::$pdo->prepare($checkUser);
            $checkUserStmt->execute([
                ':email' => $this->userEmail
            ]);

            $userCount = $checkUserStmt->rowCount();

            if($userCount === 1){
                $userDetails = $checkUserStmt->fetch(PDO::FETCH_ASSOC);
                if(password_verify($this->userPass, $userDetails['userPassword'])){
                    $_SESSION['userUuid'] = $userDetails['userUuid'];
                    $_SESSION['userEmail'] = $userDetails['userEmail'];
                    $_SESSION['userRole'] = $userDetails['userRole'];
                    $_SESSION['login'] = true;
                    $url = (isset($_SESSION['prevUrl']) ? $_SESSION['prevUrl'] : '/');
                    setcookie('userUuid', $userDetails['userUuid'], time() + (60*60), "/");

                    $this->message = "logged in";
                    $this->status = true;
                    unset($_SESSION['prevUrl']);
                }else{
                    $this->message = "Wrong password!";
                    $this->status = false;

                }
            }elseif($userCount > 1){
                
                $this->message = "This email is associated with more than one account!";
                $this->status = false;
            }else{
                
                $this->message = "Account does not exist!";
                $this->status = false;
            }

            echo json_encode([
                "status" => $this->status,
                "message" => $this->message,
                "url" => isset($url) ? $url : null
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        }

        public function logUserOut(){
            session_destroy();
            header('Location: /login');
        }
    }