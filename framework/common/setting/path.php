<?php

/**
 * 定义应用路径
 */
define('APP_PATH', realpath(dirname($_SERVER['SCRIPT_FILENAME']))); // 应用根路径
define('COM_PATH', APP_PATH . '/common'); // 应用通用路径
define('LIB_PATH', APP_PATH . '/lib'); // 应用库文件路径
define('CONF_PATH', APP_PATH . '/config'); // 应用配置路径
define('PAGE_PATH', APP_PATH . '/page'); // 页面文件路径

/**
 * 定义系统路径
 */
define('_SYS_PATH', realpath(dirname(__FILE__) . '/../..')); // 系统根路径
define('_COM_PATH', _SYS_PATH . '/common'); // 系统通用路径
define('_LIB_PATH', _SYS_PATH . '/lib'); // 系统库文件路径
define('_CONF_PATH', _SYS_PATH . '/config'); // 系统配置路径
