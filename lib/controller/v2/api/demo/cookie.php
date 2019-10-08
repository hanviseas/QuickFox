<?php
class Controller_V2_Api_Demo_Cookie extends Controller_V2_Api_Base
{
	public function act()
	{
		print_r($_COOKIE);
	}
}
