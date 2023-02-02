<?php
    class Vehicles extends DataBase {
        public static $photo;
        public static $model;
        public static $type;
        public static $color;
        public static $engineNo;
        public static $trans;
        public static $axle;
        public static $paint;
        public static $trim;
        public static $chasis;
        public static $converted;
        public static $drivenBy;
        public static $other;
        public static $regisNumber;

        public static $vehicleId;
        public static $currentPage;
        public static $currentRegisNumber;

        public static function addVehicle (){
            $newUuid = UuidGenerator::guidv4();
            $validate = "SELECT vehicleUuid FROM vehicles WHERE vehicleUuid =:vehicleUuid";
            $validateStmt = parent::$pdo->prepare($validate);
            $validateStmt->execute([
                ':vehicleUuid' => $newUuid
            ]);

            $regisNo = "SELECT regisNumber FROM vehicles WHERE regisNumber =:regisNumber";
            $regisNoStmt = parent::$pdo->prepare($regisNo);
            $regisNoStmt->execute([
                ':regisNumber' => self::$regisNumber
            ]);

            $driver = "SELECT driverIdNo, driverUuid FROM drivers WHERE driverIdNo =:did";
            $driverStmt = parent::$pdo->prepare($driver);
            $driverStmt->execute([
                ':did' => self::$drivenBy
            ]);

            $driverCount = $driverStmt->rowCount();

            if(strtolower(self::$drivenBy) !== 'no driver' && $driverCount < 1){
                RequestError::error("Driver with Identity Number [".self::$drivenBy."] is not found!");
                return;
            }

            $regisNoCount = $regisNoStmt->rowCount();
            if($regisNoCount > 0){
                RequestError::error("Vehicle with registration Number [".self::$regisNumber."] already exists!");
                return;
            }

            $count = $validateStmt->rowCount();
            if($count > 0){
                $vehicleUuid = $newUuid.'-'.time();
            }else{
                $vehicleUuid = $newUuid;
            }

            $driverUuid = $driverStmt->fetch(PDO::FETCH_ASSOC);
            

            $add = "INSERT INTO vehicles(photo, model, color, vtype, engineNo, trans, axle, paint, trim, chasis, converted, drivenBy, other, regisNumber, dateAdded, vehicleUuid) VALUES (:photo, :model, :color, :vtype, :engineNo, :trans, :axle, :paint, :trim, :chasis, :converted, :drivenBy, :other, :regisNumber, :dateAdded, :vehicleUuid)";
            $stmt = parent::$pdo->prepare($add);
            $stmt->execute([
               ':photo' => self::$photo, 
               ':model' => self::$model, 
               ':vtype' => self::$type, 
               ':color' => self::$color, 
               ':engineNo' => self::$engineNo, 
               ':trans' => self::$trans, 
               ':axle' => self::$axle, 
               ':paint' => self::$paint, 
               ':trim' => self::$trim, 
               ':chasis' => self::$chasis, 
               ':converted' => self::$converted, 
               ':drivenBy' => $driverUuid['driverUuid'] ?? strtolower(self::$drivenBy), 
               ':other' => self::$other, 
               ':regisNumber' => self::$regisNumber, 
               ':dateAdded' => date('Y-m-d'),
               ':vehicleUuid' => $vehicleUuid
            ]);

            RequestError::success("Vehicle Added!");
        }


        public static function getVehicles(){
            (new self)->__construct();
            $total = "SELECT vehicleUuid FROM vehicles";
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute();
            $totalVehicles = $totalStmt->rowCount();

            $perPage = 5;
            $totalPages = ceil($totalVehicles/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;
            $vehicles = "SELECT vehicles.model, vehicles.color, vehicles.vtype, vehicles.converted, vehicles.regisNumber, drivers.driverFullName, vehicles.engineNo, vehicles.vehicleUuid FROM vehicles LEFT JOIN drivers ON drivers.driverUuid = vehicles.drivenBy ORDER BY vehicles.id DESC LIMIT :s, :t";
            $vehiclesStmt = self::$pdo->prepare($vehicles);
            $vehiclesStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);

            $data = $vehiclesStmt->fetchAll(PDO::FETCH_ASSOC);

            RequestError::array(name: "totalVehicles", totalItem: $totalVehicles, data: $data, totalPages: $totalPages, currentPage: self::$currentPage);

        }

        public static function updateVehicle (){
            $regisNo = "SELECT regisNumber FROM vehicles WHERE regisNumber =:regisNumber";
            $regisNoStmt = parent::$pdo->prepare($regisNo);
            $regisNoStmt->execute([
                ':regisNumber' => self::$regisNumber
            ]);

            $driver = "SELECT driverIdNo, driverUuid FROM drivers WHERE driverIdNo =:did";
            $driverStmt = parent::$pdo->prepare($driver);
            $driverStmt->execute([
                ':did' => self::$drivenBy
            ]);

            $driverCount = $driverStmt->rowCount();

            if(strtolower(self::$drivenBy) !== 'no driver' && $driverCount < 1){
                RequestError::error("Driver with Identity Number [".self::$drivenBy."] is not found!");
                return;
            }

            $regisNoCount = $regisNoStmt->rowCount();
            if(self::$regisNumber !== self::$currentRegisNumber){
                if($regisNoCount > 0){
                    RequestError::error("Vehicle with registration Number [".self::$regisNumber."] already exists!");
                    return;
                }
            }
            $driverUuid = $driverStmt->fetch(PDO::FETCH_ASSOC);
            $update = "UPDATE vehicles SET photo =:photo, model =:model, color =:color, vtype =:vtype, engineNo =:engineNo, trans =:trans, axle =:axle, paint =:paint, trim =:trim, chasis =:chasis, converted =:converted, drivenBy =:drivenBy, other =:other, regisNumber =:regisNumber WHERE vehicleUuid =:vehicleUuid";
            $stmt = parent::$pdo->prepare($update);
            $stmt->execute([
               ':photo' => self::$photo, 
               ':model' => self::$model, 
               ':color' => self::$color, 
               ':vtype' => self::$type, 
               ':engineNo' => self::$engineNo, 
               ':trans' => self::$trans, 
               ':axle' => self::$axle, 
               ':paint' => self::$paint, 
               ':trim' => self::$trim, 
               ':chasis' => self::$chasis, 
               ':converted' => self::$converted, 
               ':drivenBy' => $driverUuid['driverUuid'] ?? strtolower(self::$drivenBy), 
               ':other' => self::$other, 
               ':regisNumber' => self::$regisNumber, 
               ':vehicleUuid' => self::$vehicleId
            ]);
    
            RequestError::success("Vehicle Updated!");
        }

        public static function deleteVehicle() {
            $delete = "DELETE FROM vehicles WHERE vehicleUuid =:vehicleUuid";
            $stmt = parent::$pdo->prepare($delete);
            $stmt->execute([
                ':vehicleUuid' => self::$vehicleId
            ]);
            RequestError::success("Vehicle deleted!");
        }

        public static function getVehicle():array {
            $get = "SELECT vehicles.model, vehicles.vtype, vehicles.color, vehicles.trans, vehicles.paint, vehicles.photo, vehicles.trim, vehicles.chasis, vehicles.converted, vehicles.other, vehicles.axle, vehicles.regisNumber, drivers.driverFullName, drivers.driverIdNo, vehicles.engineNo, vehicles.vehicleUuid FROM vehicles LEFT JOIN drivers ON drivers.driverUuid = vehicles.drivenBy WHERE vehicles.vehicleUuid =:vehicleUuid";
            $stmt = parent::$pdo->prepare($get);
            $stmt->execute([
                ':vehicleUuid' => self::$vehicleId
            ]);

            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            $count = $stmt->rowCount();

            return [
                "status" => true,
                "data" => $data,
                "count" => $count
            ];
        }
    }

