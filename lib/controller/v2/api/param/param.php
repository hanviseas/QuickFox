<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取参数信息
 */
class Controller_V2_Api_Param_Param extends Controller_V2_Api_Param_Base
{
	protected $request_params = array(
		'param_id' => 'int'
	);

	public function act()
	{
		$this->init_param();
		$param = LF\M('V2.Environment.Param')->get_by_id($this->params['param_id']);
		if (!$param) { // 未找到参数返回400
			$this->return_404(Const_Code::PARAM_NOT_FOUND, '参数未找到');
		}
		$this->set_json_response($param);
	}
}
