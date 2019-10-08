<?php
// +------------------------------------------------------------
// | LazyBug PHP Framework
// +------------------------------------------------------------
// | Version : 1.0.0
// +------------------------------------------------------------
// | Author : yuanhang.chen@gmail.com
// +------------------------------------------------------------
require 'common/setting/path.php';
require 'common/setting/file.php';
spl_autoload_register('\Lazybug\Framework\lb_load_from_app');
spl_autoload_register('\Lazybug\Framework\lb_load_from_system');
\Lazybug\Framework\LB::get_instance()->run();
