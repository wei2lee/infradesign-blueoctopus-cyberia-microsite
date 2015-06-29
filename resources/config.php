<?php
error_reporting(0);
// error_reporting(E_ALL);

$isDev = false;



$actual_link = "http://" . $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"];
if (strpos($actual_link, '127.0.0.1') !== false) $isDev = true;
if (strpos($actual_link, 'localhost') !== false) $isDev = true;
if (strpos($actual_link, 'staging') !== false) $isDev = true;


$config = array(
    "smtp" => array(
        "user" => "blue3522@blueoctopus.com.my",
        "pass" => "fGu+Tk\$sFtDF",
        "host" => "mail.blueoctopus.com.my",
        "port" => 587
    ),
    "isDev" => $isDev
);

?>