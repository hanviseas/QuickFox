<?php

namespace Lazybug\Framework;

// +------------------------------------------------------------
// | Request 用户请求
// +------------------------------------------------------------
// | Author : yuanhang.chen@gmail.com
// +------------------------------------------------------------
class Util_Server_Request
{
	/**
	 * 获得REQUEST参数
	 *
	 * @access public
	 * @param string $key 参数索引
	 * @return type $request 参数值
	 */
	public static function get_request($key = '')
	{
		return $key === '' ? $_REQUEST : (isset($_REQUEST[$key]) ? $_REQUEST[$key] : '');
	}

	/**
	 * 获得COOKIE参数
	 *
	 * @access public
	 * @param string $key 参数索引
	 * @return type $cookie 参数值
	 */
	public static function get_cookie($key = '')
	{
		return $key === '' ? $_COOKIE : (isset($_COOKIE[$key]) ? $_COOKIE[$key] : '');
	}

	/**
	 * 获得GET/POST参数
	 *
	 * @access public
	 * @param string $key 参数索引
	 * @param string $type 参数类型
	 * @return type $param 参数值
	 */
	public static function get_param($key = '', $type = 'get')
	{
		$param = ($type === 'get' ? $_GET : $_POST);
		return $key === '' ? $param : (isset($param[$key]) ? $param[$key] : '');
	}
}
