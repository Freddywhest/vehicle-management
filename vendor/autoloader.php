<?php
  spl_autoload_register(function($class){
    if(str_contains($class, '\\') || strpos($class, '\\') > 0){
        $class2 = explode('\\', $class);
        $class = end($class2);
    }
    if (is_readable($_SERVER['DOCUMENT_ROOT'].'/controllers/classes/'.$class . '.Class.php')) {
        include_once $_SERVER['DOCUMENT_ROOT'].'/controllers/classes/'.$class . '.Class.php';
    }  else if (is_readable($_SERVER['DOCUMENT_ROOT'].'/models/'.$class . '.Class.php')) {
        include_once $_SERVER['DOCUMENT_ROOT'].'/models/'.$class . '.Class.php';
    }

  });