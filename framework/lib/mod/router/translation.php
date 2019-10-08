<?php

namespace Lazybug\Framework;

// +------------------------------------------------------------
// | Router 转换路由器
// +------------------------------------------------------------
// | 将请求路径转换成对应控制器
// +------------------------------------------------------------
// | Author : yuanhang.chen@gmail.com
// +------------------------------------------------------------
class Mod_Router_Translation extends Lb_Router
{
	/**
	 * 地址解析
	 *
	 * @access public
	 * @return string $controller 控制器
	 */
	public function dispatch()
	{
		$request = parse_url(strtolower(preg_replace('/\/$/', '', $_SERVER['REQUEST_URI'])));
		$components = explode('/', preg_replace('/^\/index.php/', '', $request['path']));
		if (!isset($components[1]) || !$components[1]) {
			$components[1] = 'Home';
		}
		if (!isset($components[2]) || !$components[2]) {
			$components[2] = 'Index';
		}
		return $components[1] . '.' . $components[2];
	}
}
