<?php

/**
 * 载入函数文件
 */
require _SYS_PATH . '/common/function/base.php'; // 基本函数
require _SYS_PATH . '/common/function/framework.php'; // 框架函数
require _SYS_PATH . '/common/function/other.php'; // 其他函数

/**
 * 载入框架文件
 */
require _SYS_PATH . '/lib/core/lazybug.php'; // 框架核心文件
require _SYS_PATH . '/lib/core/router.php'; // 路由器基类
require _SYS_PATH . '/lib/core/intercepter.php'; // 拦截器基类
require _SYS_PATH . '/lib/core/controller.php'; // 控制器基类
require _SYS_PATH . '/lib/core/model.php'; // 模型基类
require _SYS_PATH . '/lib/core/view.php'; // 视图基类
