<?php

use Lazybug\Framework as LF;

/**
 * Controller 删除用例
 */
class Controller_V2_Api_Case_Remove extends Controller_V2_Api_Case_Base
{
	protected $request_params = array(
		'case_id' => 'int'
	);

	protected $required_params = array(
		'case_id'
	);

	public function act()
	{
		$this->init_param(Const_Code::CASE_PARAM_ERROR, '用例传递参数错误');
		if ($this->params['case_id'] <= 3 && LF\lb_read_system('demo') === true) {
			$this->return_400(Const_Code::CASE_PARAM_ERROR, '演示模式下内置用例不能删除');
		}
		$case = LF\M('V2.Space.Case')->get_by_id($this->params['case_id']);
		if (!$case) { // 未找到用例返回400
			$this->return_404(Const_Code::CASE_NOT_FOUND, '用例未找到');
		}
		LF\M('V2.Space.Step')->remove_by_case($this->params['case_id']);
		LF\M('V2.Space.Case')->remove_by_id($this->params['case_id']);
		// 尝试取回数据，如果取回成功返回400
		if (LF\M('V2.Space.Case')->get_by_id($this->params['case_id'])) {
			$this->return_400(Const_Code::DELETE_CASE_FAIL, '用例删除失败');
		}
		$this->log('删除用例: ID-' . $this->params['case_id'] . ' ' . $case['name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '用例删除成功');
	}
}
