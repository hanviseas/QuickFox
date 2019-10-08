<?php

use Lazybug\Framework as LF;

/**
 * Controller 环境检查页面
 */
class Controller_V2_Page_Guest_Check extends Controller_V2_Base
{

	public function act()
	{
		$view = LF\V('Html.V2.Guest.Check');
	}
}
