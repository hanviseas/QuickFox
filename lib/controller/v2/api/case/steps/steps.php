<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取用例步骤
 */
class Controller_V2_Api_Case_Steps_Steps extends Controller_V2_Api_Case_Base
{
	protected $request_params = array(
		'page' => 'int',
		'size' => 'int',
		'case_id' => 'int'
	);

	public function act()
	{
		$this->init_param();
		if (!LF\M('V2.Space.Case')->get_by_id($this->params['case_id'])) { // 未找到用例返回400
			$this->return_404(Const_Code::CASE_NOT_FOUND, '用例未找到');
		}
		$steps = LF\M('V2.Space.Step')->get_by_case($this->params['case_id'], $this->params['page'], $this->params['size']);
		$this->set_json_response($steps);
	}
}
