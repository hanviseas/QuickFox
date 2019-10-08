<?php

use Lazybug\Framework\Mod_View_Json;
use Lazybug\Framework\Util_Server_Response as Response;

/**
 * View Json视图基类
 */
class View_Json_Base extends Mod_View_Json
{
	public function __construct()
	{
		parent::__construct();
		Response::set_header_content('application/json; charset=utf-8');
	}

	public function init($code = '000000', $message = '')
	{
		$result = array(
			'code' => $code,
			'message' => $message
		);
		$this->set_data($result);
		$this->output();
	}
}
