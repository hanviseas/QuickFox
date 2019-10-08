<?php

use Lazybug\Framework as LF;
use Lazybug\Framework\Util_Server_Response as Response;

/**
 * Controller 登出页面
 */
class Controller_V2_Page_Guest_Logout extends Controller_V2_Base
{

	public function act()
	{
		session_unset();
		session_destroy();
		Response::set_header_location('/index.php');
		exit();
	}
}
