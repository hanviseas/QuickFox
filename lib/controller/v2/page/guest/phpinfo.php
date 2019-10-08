<?php

/**
 * Controller PHPINFO调试
 */
class Controller_V2_Page_Guest_Phpinfo extends Controller_V2_Page_Base
{
	public function act()
	{
		phpinfo();
	}
}
