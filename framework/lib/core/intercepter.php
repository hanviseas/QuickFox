<?php

namespace Lazybug\Framework;

// +------------------------------------------------------------
// | Intercepter 拦截器基类
// +------------------------------------------------------------
// | 在控制器响应前做中断检查
// +------------------------------------------------------------
// | Author : yuanhang.chen@gmail.com
// +------------------------------------------------------------
abstract class Lb_Intercepter
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
	 * 拦截器主函数
	 *
	 * @access public
	 */
	abstract public function interrupt();
}
