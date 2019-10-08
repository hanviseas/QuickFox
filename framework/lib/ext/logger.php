<?php

namespace Lazybug\Framework;

// +------------------------------------------------------------
// | Logger 记录器
// +------------------------------------------------------------
// | 保存和输出日志相关信息
// +------------------------------------------------------------
// | Author : yuanhang.chen@gmail.com
// +------------------------------------------------------------
class Lb_Ext_Logger
{
	/**
	 * 日志数据
	 *
	 * @access private
	 * @static array $log_data 日志数据
	 */
	private static $log_data = array();

	/**
	 * 记录日志
	 *
	 * @access public
	 * @param int $type 日志类型
	 * @param string $message 日志信息
	 */
	public static function record($type, $message)
	{
		self::$log_data[$type][] = array(
			'message' => $message,
			'time' => microtime(true)
		);
	}
}
