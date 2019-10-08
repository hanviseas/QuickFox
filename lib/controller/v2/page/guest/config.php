<?php

use Lazybug\Framework as LF;
use Lazybug\Framework\Util_Server_Response as Response;

/**
 * Controller 配置页面
 */
class Controller_V2_Page_Guest_Config extends Controller_V2_Base
{

	public function act()
	{
		$view = LF\V('Html.V2.Guest.Config');
	}
}
