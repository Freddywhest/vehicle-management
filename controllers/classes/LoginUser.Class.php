<?php
    class LoginUser extends DataBase{
        public static $newUserPhoto;
        public static $newFullName;
        public static function getLoginUser():array {
            $user = "SELECT * FROM users WHERE userUuid =:id";
            $stmt = parent::$pdo->prepare($user);
            $stmt->execute([
                ':id' => $_SESSION['userUuid'] 
            ]);
            
            $currentUser = $stmt->fetch(PDO::FETCH_ASSOC);
            return $currentUser;
        }

        public static function updateProfile() {
            $update = "UPDATE users SET photo =:photo, fullName =:fullName WHERE userUuid =:id";
            $stmt = parent::$pdo->prepare($update);
            $stmt->execute([
                ':photo' => self::$newUserPhoto,
                ':fullName' => self::$newFullName,
                ':id' => $_SESSION['userUuid']
            ]);

            echo json_encode([
                "status" => true,
                "message" => "Profile updated!"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        
        }
    }