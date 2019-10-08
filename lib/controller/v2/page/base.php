<?php

use Lazybug\Framework\Util_Server_Response as Response;

/**
 * Controller 页面控制器基类
 */
abstract class Controller_V2_Page_Base extends Controller_V2_Base
{
	/**
	 * 页面授权检查
	 */
	protected function check_page_auth()
	{
		if (!$this->check_auth()) { // 授权失败跳转到授权提示页面
			Response::set_header_location('/index.php/v2/g/login');
			exit();
		}
	}
}
