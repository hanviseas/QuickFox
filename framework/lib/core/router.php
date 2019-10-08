<?php

namespace Lazybug\Framework;

// +------------------------------------------------------------
// | Router 路由器基类
// +------------------------------------------------------------
// | 解析用户请求到相应控制器
// +------------------------------------------------------------
// | Author : yuanhang.chen@gmail.com
// +------------------------------------------------------------
abstract class Lb_Router
{
	/**
	 * 构造函数
	 *
	 * @access public
	 */
	public function __construct()
	{ }

	/**
	 * 析构函数
	 *
	 * @access public
	 */
	public function __destruct()
	{ }

	/**
	 * 路由器主函数
	 *
	 * @access public
	 */
	abstract public function dispatch();
}
