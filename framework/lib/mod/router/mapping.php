<?php

namespace Lazybug\Framework;

// +------------------------------------------------------------
// | Router 映射路由器
// +------------------------------------------------------------
// | 根据路由配置将请求地址映射到控制器
// +------------------------------------------------------------
// | Author : yuanhang.chen@gmail.com
// +------------------------------------------------------------
class Mod_Router_Mapping extends Lb_Router
{
	/**
	 * 路径参数
	 *
	 * @access private
	 * @static array $path_params 路径参数
	 */
	private static $path_params = array();

	/**
	 * 获得路径参数
	 *
	 * @access public
	 * @param string $key 参数索引
	 * @return type path_param 路径参数值
	 */
	public static function get_path_param($key)
	{
		return isset(self::$path_params[$key]) ? self::$path_params[$key] : '';
	}

	/**
	 * 地址解析
	 *
	 * @access public
	 * @return string $controller 控制器
	 */
	public function dispatch()
	{
		$request = parse_url(strtolower(preg_replace('/\/$/', '', $_SERVER['REQUEST_URI'])));
		$path = preg_replace('/^\/index.php/', '', $request['path']);
		foreach ((array) lb_read_config('intercept') as $intercepter => $url) {
			$real_url = preg_replace('/\{\$\w+\}/', '-?\w+', $url);
			if (preg_match('/^' . str_replace('/', '\/', $url) . '$/', $path)) {
				if (!is_null($controller = lb_call_intercepter($intercepter))) {
					return $controller;
				}
			}
		}
		foreach ((array) lb_read_config('route') as $controller => $url) {
			$real_url = preg_replace('/\{\$\w+\}/', '-?\w+', $url);
			if (preg_match('/^' . str_replace('/', '\/', $real_url) . '$/', $path)) {
				$url_components = explode('/', $url);
				$path_components = explode('/', $path);
				if (count($url_components) === count($path_components)) {
					foreach ($url_components as $index => $value) {
						if (preg_match('/\{\$\w+\}/', $value)) {
							self::$path_params[substr($value, 2, -1)] = $path_components[$index];
						}
					}
				}
				return $controller;
			}
		}
	}
}
