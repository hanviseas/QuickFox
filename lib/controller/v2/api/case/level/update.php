<?php

use Lazybug\Framework as LF;

/**
 * Controller 设置用例等级
 */
class Controller_V2_Api_Case_Level_Update extends Controller_V2_Api_Case_Base
{
	protected $request_params = array(
		'case_id' => 'int',
		'case_level' => 'int'
	);

	protected $required_params = array(
		'case_id',
		'case_level'
	);

	public function act()
	{
		$this->init_param(Const_Code::CASE_PARAM_ERROR, '用例传递参数错误');
		$case = LF\M('V2.Space.Case')->get_by_id($this->params['case_id']);
		if (!$case) { // 未找到用例返回400
			$this->return_404(Const_Code::CASE_NOT_FOUND, '用例未找到');
		}
		// 用例的值范围在1-4之间，3为默认等级
		if ($this->params['case_level'] > 4 || $this->params['case_level'] < 1) {
			$this->params['case_level'] = 3;
		}
		// 更新用例
		$return = LF\M('V2.Space.Case')->set_my_level($this->params['case_id'], $this->params['case_level']);
		if (is_null($return)) { // 无更新返回400
			$this->return_400(Const_Code::UPDATE_CASE_FAIL, '用例等级更新失败');
		}
		$this->log('更新用例等级: ID-' . $this->params['case_id'] . ' ' . $case['name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '用例等级更新成功');
	}
}
