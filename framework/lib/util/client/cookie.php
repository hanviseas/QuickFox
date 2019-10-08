<?php

namespace Lazybug\Framework;

// +------------------------------------------------------------
// | Cookie 本地数据
// +------------------------------------------------------------
// | Author : yuanhang.chen@gmail.com
// +------------------------------------------------------------
class Util_Client_Cookie
{
	/**
	 * 设置Cookie
	 *
	 * @access public
	 * @param string $key 数据索引
	 * @param string $value 数据值
	 * @param int $time 过期时间
	 * @param string $path 设置路径
	 * @param string $domain 设置域
	 * @return bool $cookie 返回状态
	 */
	public static function set_cookie($key, $value, $time = 0, $path = null, $domain = null)
	{
		$time && $time = time() + intval($time);
		$path || $path = lb_read_system('cookie_path');
		$domain || $domain = lb_read_system('cookie_domain');
		return setcookie($key, $value, $time, $path, $domain);
	}

	/**
	 * 注销Cookie
	 *
	 * @access public
	 * @param string $key 数据索引
	 * @param string $path 设置路径
	 * @param string $domain 设置域
	 * @return bool $cookie 返回状态
	 */
	public static function unset_cookie($key, $path = null, $domain = null)
	{
		return self::set_cookie($key, null, -3600, $path, $domain);
	}
}
