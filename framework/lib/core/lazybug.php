<?php

namespace Lazybug\Framework;

// +------------------------------------------------------------
// | LazyBug 框架核心类
// +------------------------------------------------------------
// | 分配和管理系统各个主要部件或数据
// +------------------------------------------------------------
// | Author : yuanhang.chen@gmail.com
// +------------------------------------------------------------
final class LB
{
	/**
	 * 静态实例
	 *
	 * @access private
	 * @static object $instance 静态实例
	 */
	private static $instance;

	/**
	 * 控制器
	 *
	 * @access private
	 * @var string $controller 控制器
	 */
	private $controller = '';

	/**
	 * 应用数据
	 *
	 * @access private
	 * @var array $app_data 应用数据
	 */
	private $app_data = array();

	/**
	 * 获得实例对象
	 *
	 * @access public
	 * @return object $instance 实例对象
	 */
	public static function &get_instance()
	{
		self::$instance || self::$instance = new LB();
		return self::$instance;
	}

	/**
	 * 获得控制器
	 *
	 * @access public
	 * @return string $controller 控制器
	 */
	public function get_controller()
	{
		return $this->controller;
	}

	/**
	 * 设置控制器
	 *
	 * @access public
	 * @param string $controller 控制器
	 */
	public function set_controller($controller)
	{
		$this->controller = $controller;
	}

	/**
	 * 获得应用数据
	 *
	 * @access public
	 * @param string $key 数据索引
	 * @return type $app_datum 数据值
	 */
	public function get_app_data($key)
	{
		return $this->app_data[$key];
	}

	/**
	 * 设置应用数据
	 *
	 * @access public
	 * @param string $key 数据索引
	 * @param type $value 数据值
	 */
	public function set_app_data($key, $value)
	{
		$this->app_data[$key] = $value;
	}

	/**
	 * 框架主执行函数
	 *
	 * @access public
	 */
	public function run()
	{
		$this->controller = lb_call_router(lb_read_system('class_router'));
		$this->controller || $this->controller = lb_read_system('error_page_404');
		lb_call_controller($this->controller);
	}
}
