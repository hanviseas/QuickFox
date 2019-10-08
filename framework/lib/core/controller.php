<?php

namespace Lazybug\Framework;

// +------------------------------------------------------------
// | Controller 控制器基类
// +------------------------------------------------------------
// | 接受用户输入并调用模型和视图完成用户需求
// +------------------------------------------------------------
// | Author : yuanhang.chen@gmail.com
// +------------------------------------------------------------
abstract class Lb_Controller
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
	 * 控制器主函数
	 *
	 * @access public
	 */
	abstract public function act();
}
