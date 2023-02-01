<?php
    declare(strict_types = 1);
    

    class Installer{
        public static string $dbUser;
        public static string $dbHost;
        public static string $dbPass;
        public static string $dbName;
        

        protected static $pdo;
        private string $dsn;

        public function __construct(){
            try{
                $this->dsn = "mysql:host=".self::$dbHost."";
                self::$pdo = new PDO($this->dsn, self::$dbUser, self::$dbPass);
                
                $database = "CREATE DATABASE IF NOT EXISTS `".self::$dbName."`";
                $databaseStmt = self::$pdo->prepare($database);
                $databaseStmt->execute();
            } catch (PDOException $e) {
                RequestError::error("An error occurred while creating the database, Please check if the Database information/credentials provided is correct!");
                die();
                if(file_exists($_SERVER['DOCUMENT_ROOT'].'/controllers/classes/DataBase.Class.php')){
                    unlink($_SERVER['DOCUMENT_ROOT'].'/controllers/classes/DataBase.Class.php');
                }
            }
        }

        static public function installDataBase(){
            file_put_contents($_SERVER['DOCUMENT_ROOT'].'/controllers/classes/DataBase.Class.php', '<'.'?php 
declare(strict_types = 1);
class DataBase {
    protected static $pdo;
    protected $dbname;
    protected $dbuser;
    protected $dbpass;
    protected $host;
    protected $dsn;

    public function __construct(){
        try {
            $this->dbname = \''.self::$dbName.'\';
            $this->host = \''.self::$dbHost.'\';
            $this->dbuser = \''.self::$dbUser.'\';
            $this->dbpass = \''.self::$dbPass.'\';
            $this->dsn = "mysql:dbname={$this->dbname};host={$this->host}";
            self::$pdo = new PDO($this->dsn, $this->dbuser, $this->dbpass);
            self::$pdo->setAttribute( PDO::ATTR_EMULATE_PREPARES, false );

        } catch (PDOException $e) {
            header(\'/\');
        }
    }
}');
        }

    }