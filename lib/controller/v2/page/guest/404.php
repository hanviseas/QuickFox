<?php

use Lazybug\Framework as LF;
use Lazybug\Framework\Util_Server_Response as Response;

/**
 * Controller "404"页面
 */
class Controller_V2_Page_Guest_404 extends Controller_V2_Base
{

	public function act()
	{
		Response::set_header_404();
		$view = LF\V('Html.V2.Guest.404');
	}
}
