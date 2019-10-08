<?php

namespace Lazybug\Framework;

// +------------------------------------------------------------
// | Response 用户响应
// +------------------------------------------------------------
// | Author : yuanhang.chen@gmail.com
// +------------------------------------------------------------
class Util_Server_Response
{
	/**
	 * 设置头信息
	 *
	 * @access public
	 * @param string $key 报头字符串
	 * @param string $value 报头字符串
	 * @param bool $replace 是否替换
	 * @param int $code 响应码
	 */
	public static function set_header($key, $value, $replace = true, $code = null)
	{
		header($key . ':' . $value, $replace ? true : false, $code);
	}

	/**
	 * 设置状态头信息
	 *
	 * @access public
	 * @param string $status 状态值
	 */
	public static function set_header_status($status)
	{
		self::set_header('Status', $status);
	}

	/**
	 * 设置定向头信息
	 *
	 * @access public
	 * @param string $url 定向地址
	 * @param int $code 定向类型
	 */
	public static function set_header_location($url, $code = 302)
	{
		self::set_header('Location', $url, true, $code === 301 ? 301 : 302);
	}

	/**
	 * 设置内容头信息
	 *
	 * @access public
	 * @param string $type 内容类型
	 */
	public static function set_header_content($type)
	{
		self::set_header('Content-Type', $type);
	}

	/**
	 * 设置状态码301
	 *
	 * @access public
	 */
	public static function set_header_301()
	{
		header('HTTP/1.1 301 Moved Permanently');
	}

	/**
	 * 设置状态码302
	 *
	 * @access public
	 */
	public static function set_header_302()
	{
		header('HTTP/1.1 302 Found');
	}

	/**
	 * 设置状态码304
	 *
	 * @access public
	 */
	public static function set_header_304()
	{
		header('HTTP/1.1 304 Not Modified');
	}

	/**
	 * 设置状态码400
	 *
	 * @access public
	 */
	public static function set_header_400()
	{
		header('HTTP/1.1 400 Bad Request');
	}

	/**
	 * 设置状态码401
	 *
	 * @access public
	 */
	public static function set_header_401()
	{
		header('HTTP/1.1 401 Unauthorized');
	}

	/**
	 * 设置状态码403
	 *
	 * @access public
	 */
	public static function set_header_403()
	{
		header('HTTP/1.1 403 Forbidden');
	}

	/**
	 * 设置状态码404
	 *
	 * @access public
	 */
	public static function set_header_404()
	{
		header('HTTP/1.1 404 Not Found');
	}

	/**
	 * 设置状态码500
	 *
	 * @access public
	 */
	public static function set_header_500()
	{
		header('HTTP/1.1 500 Internal Server Error');
	}

	/**
	 * 设置状态码502
	 *
	 * @access public
	 */
	public static function set_header_502()
	{
		header('HTTP/1.1 502 Bad Gateway');
	}

	/**
	 * 设置状态码503
	 *
	 * @access public
	 */
	public static function set_header_503()
	{
		header('HTTP/1.1 503 Service Unavailable');
	}
}
