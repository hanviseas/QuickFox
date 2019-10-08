<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取用例信息
 */
class Controller_V2_Api_Case_Case extends Controller_V2_Api_Case_Base
{
	protected $request_params = array(
		'case_id' => 'int'
	);

	public function act()
	{
		$this->init_param();
		$case = LF\M('V2.Space.Case')->get_by_id($this->params['case_id']);
		if (!$case) { // 未找到用例返回400
			$this->return_404(Const_Code::CASE_NOT_FOUND, '用例未找到');
		}
		$this->set_json_response($case);
	}
}
