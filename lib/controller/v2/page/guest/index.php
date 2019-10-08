<?php

use Lazybug\Framework as LF;

/**
 * Controller 访客页面统一入口
 */
class Controller_V2_Page_Guest_Index extends Controller_V2_Page_Base
{
	public function act()
	{
		$view = LF\V('Html.V2.Guest.Index');
	}
}
