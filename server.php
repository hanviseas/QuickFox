<?php
ini_set('date.timezone', 'Asia/Shanghai');
require 'framework/common/setting/path.php';
require 'framework/common/setting/file.php';
spl_autoload_register('\Lazybug\Framework\lb_load_from_app');
spl_autoload_register('\Lazybug\Framework\lb_load_from_system');
gc_enable();

$server = new Server_Server();
$server->start();
