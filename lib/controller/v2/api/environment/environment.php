<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取环境信息
 */
class Controller_V2_Api_Environment_Environment extends Controller_V2_Api_Environment_Base
{
	protected $request_params = array(
		'environment_id' => 'int'
	);

	public function act()
	{
		$this->init_param();
		if ($this->params['environment_id'] === 0) { // 默认环境
			$environment = array(
				'id' => 0,
				'name' => '默认环境'
			);
		} else {
			$environment = LF\M('V2.Environment')->get_by_id($this->params['environment_id']);
		}
		if (!$environment) { // 未找到环境返回400
			$this->return_404(Const_Code::ENVIRONMENT_NOT_FOUND, '环境未找到');
		}
		$this->set_json_response($environment);
	}
}
