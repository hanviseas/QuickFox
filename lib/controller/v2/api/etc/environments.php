<?php

use Lazybug\Framework as LF;

/**
 * Controller 环境信息
 */
class Controller_V2_Api_Etc_Environments extends Controller_V2_Api_Base
{

	public function act()
	{
		$environments = array();
		// 检查数据库连接
		try {
			$user = LF\M('V2.User');
			$environments['database'] = 1;
		} catch (Exception $e) {
			$environments['database'] = 0;
		}
		// 检查Curl模块
		if (extension_loaded('curl')) {
			$environments['curl_module'] = 1;
		} else {
			$environments['curl_module'] = 0;
		}
		// 检查Curl模块
		if (extension_loaded('sockets')) {
			$environments['sockets_module'] = 1;
		} else {
			$environments['sockets_module'] = 0;
		}
		$this->set_json_response($environments);
	}
}
