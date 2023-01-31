<?php
    class Settings extends DataBase{
        public static $newLogo;
        public static $newSiteName;
        public static $getSiteName;
        public static $getLogo;

        public static function getSettings() {
            (new self)->__construct();
            $settings = "SELECT * FROM settings";
            $stmt = self::$pdo->prepare($settings);
            $stmt->execute();
            
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            self::$getLogo = $data['siteLogo'];
            self::$getSiteName = $data['siteName'];
        }

        public static function updateSettings(){
            $updateWebsite = "UPDATE settings SET siteLogo =:siteLogo, siteName =:siteName";
            $updateWebsiteStmt = self::$pdo->prepare($updateWebsite);
            $updateWebsiteStmt->execute([
                ':siteLogo' => self::$newLogo,
                ':siteName' => self::$newSiteName
            ]);

            echo json_encode([
                "status" => true,
                "message" => "Settings updated successfully!"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }
    }