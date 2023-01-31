<?php
    class CheckUser extends DataBase{
        public static bool $userAvailable;
        public static string $userUuid;

        public static function checkUserAvailable():void{
            (new self)->__construct();
            $select = "SELECT userUuid FROM users WHERE userUuid =:uuid AND userStatus =:userStatus";
            $selectStmt = self::$pdo->prepare($select);
            $selectStmt->execute([
                ':uuid' => self::$userUuid,
                ':userStatus' => 'active'
            ]);

            $count = $selectStmt->rowCount();
            if($count < 1){
                self::$userAvailable = false;
            }else{
                self::$userAvailable = true;
            }
        }
    }