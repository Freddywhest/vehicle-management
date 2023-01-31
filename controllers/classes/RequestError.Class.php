<?php
    class RequestError {
        public static function error(string $message):void{
            echo json_encode([
                "status" => false,
                "message" => $message
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }

        public static function success(string $message):void{
            echo json_encode([
                "status" => true,
                "message" => $message
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }
        
        public static function singleArray(array $array):void{
            echo json_encode([
                "status" => true,
                "data" => $array
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }
        
        public static function array(string $name, string|int $totalItem, array $data, string|int $totalPages, string|int $currentPage):void{
            echo json_encode([
                "status" => true,
                "data" => $data,
                "totalPages" => $totalPages,
                $name => $totalItem,
                "role" => $_SESSION['userRole'],
                "currentPage" => $currentPage
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }
    }