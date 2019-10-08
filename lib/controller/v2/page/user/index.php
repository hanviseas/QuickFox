<?php

use Lazybug\Framework as LF;

/**
 * Controller 用户页面统一入口
 */
class Controller_V2_Page_User_Index extends Controller_V2_Page_Base
{
	public function __construct()
	{
		$this->check_page_auth();
	}

	public function act()
	{
		$view = LF\V('Html.V2.User.Index');
	}
}
