<?php

namespace Lazybug\Framework;

// +------------------------------------------------------------
// | Factory 数据库工厂
// +------------------------------------------------------------
// | 创建和管理数据库对象
// +------------------------------------------------------------
// | Author : yuanhang.chen@gmail.com
// +------------------------------------------------------------
class Driver_Db_Factory
{
	/**
	 * 对象列表
	 *
	 * @access private
	 * @static array $db_list 对象列表
	 */
	private static $db_list = array();

	/**
	 * 获得连接
	 *
	 * @access public
	 * @param string $name 连接索引
	 * @return object $item 连接对象
	 */
	public static function get_db_item($name = 'mysql.master')
	{
		if (!isset(self::$db_list[$name])) {
			self::$db_list[$name] = lb_load_database($name);
		}
		return self::$db_list[$name];
	}

	/**
	 * 关闭连接
	 *
	 * @access public
	 * @param string $name 连接索引
	 */
	public static function close_db_item($name = 'mysql.master')
	{
		if (isset(self::$db_list[$name])) {
			self::$db_list[$name]->close();
			unset(self::$db_list[$name]);
		}
	}
}
