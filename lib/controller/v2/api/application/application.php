<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取应用信息
 */
class Controller_V2_Api_Application_Application extends Controller_V2_Api_Application_Base
{
	protected $request_params = array(
		'application_id' => 'int'
	);

	public function act()
	{
		$this->init_param();
		$application = LF\M('V2.Application')->get_by_id($this->params['application_id']);
		if (!$application) { // 未找到应用返回400
			$this->return_404(Const_Code::APP_NOT_FOUND, '应用未找到');
		}
		$this->set_json_response($application);
	}
}
