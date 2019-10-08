<?php

namespace Lazybug\Framework;

// +------------------------------------------------------------
// | Monitor 监视器
// +------------------------------------------------------------
// | 搜集和输出性能相关信息
// +------------------------------------------------------------
// | Author : yuanhang.chen@gmail.com
// +------------------------------------------------------------
class Lb_Ext_Monitor
{
	/**
	 * 性能数据
	 *
	 * @access private
	 * @static array $performance_data 性能数据
	 */
	private static $performance_data = array();

	/**
	 * 开始监测
	 *
	 * @access public
	 * @param string $key 数据索引
	 */
	public static function start($key)
	{
		self::$performance_data[$key]['begin'] = microtime(true);
	}

	/**
	 * 结束监测
	 *
	 * @access public
	 * @param string $key 数据索引
	 */
	public static function end($key)
	{
		self::$performance_data[$key]['end'] = microtime(true);
	}
}
