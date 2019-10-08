<?php

use Lazybug\Framework as LF;
use Lazybug\Framework\Util_Server_Response as Response;

/**
 * Controller "403"页面
 */
class Controller_V2_Page_Guest_403 extends Controller_V2_Base
{

	public function act()
	{
		Response::set_header_403();
		$view = LF\V('Html.V2.Guest.403');
	}
}
