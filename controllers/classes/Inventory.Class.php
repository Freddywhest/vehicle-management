<?php
    class Inventory extends DataBase{
        public static string $inventoryName;
        public static string $vehicleBrand;
        public static string $inventoryCondition;
        public static int|string $quantity;
        public static string $photo;
        public static string $filter;
        public static string $currentPage;
        public static int|string $inventoryId;
        
        public static function addInventory():void{
            $add = "INSERT INTO inventory(inventoryName, vehicleBrand, inventoryCondition, quantity, photo) VALUES(:inventoryName, :vehicleBrand, :inventoryCondition, :quantity, :photo)";
            $stmt = parent::$pdo->prepare($add);
            $stmt->execute([
                ':inventoryName' => self::$inventoryName,
                ':vehicleBrand' => self::$vehicleBrand,
                ':inventoryCondition' => self::$inventoryCondition,
                ':quantity' => self::$quantity,
                ':photo' => self::$photo
            ]);

            RequestError::success("Added!");
        }

        public static function updateInventory():void{
            $update = "UPDATE inventory SET inventoryName =:inventoryName, vehicleBrand =:vehicleBrand, inventoryCondition =:inventoryCondition, quantity =:quantity, photo =:photo WHERE id =:id";
            $stmt = parent::$pdo->prepare($update);
            $stmt->execute([
                ':inventoryName' => self::$inventoryName,
                ':vehicleBrand' => self::$vehicleBrand,
                ':inventoryCondition' => self::$inventoryCondition,
                ':quantity' => self::$quantity,
                ':photo' => self::$photo,
                ':id' => self::$inventoryId
            ]);

            RequestError::success("Update!");
            
        }

        public static function updateQty():void{
            $update = "UPDATE inventory SET quantity =:quantity WHERE id =:id";
            $stmt = parent::$pdo->prepare($update);
            $stmt->execute([
                ':quantity' => self::$quantity,
                ':id' => self::$inventoryId
            ]);

            RequestError::success("Update!");
            
        }

        public static function deleteInventory():void{
            $delete = "DELETE FROM inventory WHERE id =:id";
            $stmt = parent::$pdo->prepare($delete);
            $stmt->execute([
                ':id' => self::$inventoryId
            ]);

            RequestError::success("Deleted!");
        }

        public static function getInventory(string|int $inventoryId):array{
            $inventory = "SELECT * FROM inventory WHERE id =:id";
            $stmt = parent::$pdo->prepare($inventory);
            $stmt->execute([
                ':id' => $inventoryId
            ]);

            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            $count = $stmt->rowCount();

            return [
                "status" => true,
                "count" => $count,
                "data" => $data
            ];
        }

        public static function getInventories():void{
            $total = "SELECT id FROM inventory";
            $totalStmt = parent::$pdo->prepare($total);
            $totalStmt->execute();
            $total = $totalStmt->rowCount();

            $perPage = 10;
            $totalPages = ceil($total/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;

            if(self::$filter === 'default'){
                $inventory = "SELECT * FROM inventory ORDER BY id DESC LIMIT :s, :t";
            }elseif(self::$filter === 'old'){
                $inventory = "SELECT * FROM inventory ORDER BY id ASC LIMIT :s, :t";
            }else{
                $inventory = "SELECT * FROM inventory ORDER BY id DESC LIMIT :s, :t";
            }

            $inventoryStmt = parent::$pdo->prepare($inventory);
            $inventoryStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);

            $data = $inventoryStmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "status" => true,
                "data" => $data,
                "totalPages" => $totalPages,
                "total" => $total,
                "role" => $_SESSION['userRole'],
                "currentPage" => self::$currentPage
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }


        public static function searchInventories(string|int $search):void{
            $total = "SELECT id FROM inventory WHERE inventoryName LIKE :search";
            $totalStmt = parent::$pdo->prepare($total);
            $totalStmt->execute([
                ':search' => '%'.$search.'%'
            ]);
            $total = $totalStmt->rowCount();

            $perPage = 1;
            $totalPages = ceil($total/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;

            if(self::$filter === 'default'){
                $inventory = "SELECT * FROM inventory WHERE inventoryName LIKE :search ORDER BY id DESC LIMIT :s, :t";
            }elseif(self::$filter === 'old'){
                $inventory = "SELECT * FROM inventory WHERE inventoryName LIKE :search ORDER BY id ASC LIMIT :s, :t";
            }else{
                $inventory = "SELECT * FROM inventory WHERE inventoryName LIKE :search ORDER BY id DESC LIMIT :s, :t";
            }

            $inventoryStmt = parent::$pdo->prepare($inventory);
            $inventoryStmt->execute([
                ':s' => $offset,
                ':t' => $perPage,
                ':search' => '%'.$search.'%'
            ]);

            $data = $inventoryStmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "status" => true,
                "data" => $data,
                "totalPages" => $totalPages,
                "total" => $total,
                "role" => $_SESSION['userRole'],
                "currentPage" => self::$currentPage
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }

    }