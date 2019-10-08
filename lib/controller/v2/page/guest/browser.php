<?php

use Lazybug\Framework as LF;

/**
 * Controller 浏览器不支持页面
 */
class Controller_V2_Page_Guest_Browser extends Controller_V2_Base
{

	public function act()
	{
		$view = LF\V('Html.V2.Guest.Browser');
	}
}
