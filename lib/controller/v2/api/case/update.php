<?php

use Lazybug\Framework as LF;

/**
 * Controller 更新用例
 */
class Controller_V2_Api_Case_Update extends Controller_V2_Api_Case_Base
{
	protected $request_params = array(
		'case_id' => 'int',
		'case_name' => 'string',
		'request_type' => 'string',
		'content_type' => 'string',
		'request_param' => 'string',
		'request_header' => 'string'
	);

	protected $required_params = array(
		'case_id',
		'case_name',
		'request_type',
		'content_type'
	);

	public function act()
	{
		$this->init_param(Const_Code::CASE_PARAM_ERROR, '用例传递参数错误');
		if ($this->params['case_id'] <= 3 && LF\lb_read_system('demo') === true) {
			$this->return_400(Const_Code::CASE_PARAM_ERROR, '演示模式下内置用例不能修改');
		}
		$case = LF\M('V2.Space.Case')->get_by_id($this->params['case_id']);
		if (!$case) { // 未找到用例返回400
			$this->return_404(Const_Code::CASE_NOT_FOUND, '用例未找到');
		}
		// 名称在接口范围内唯一，如果重复返回400
		if (LF\M('V2.Space.Case')->is_name_exists_in_item((int) $case['item_id'], $this->params['case_name'], $this->params['case_id'])) {
			$this->return_400(Const_Code::UPDATE_CASE_EXISTS, '用例名称重复');
		}
		// 更新用例
		$return = LF\M('V2.Space.Case')->modify_by_id($this->params['case_id'], array(
			'name' => $this->params['case_name'],
			'stype' => $this->params['request_type'],
			'ctype' => $this->params['content_type'],
			'param' => $this->params['request_param'],
			'header' => $this->params['request_header']
		));
		if (is_null($return)) { // 无更新返回400
			$this->return_400(Const_Code::UPDATE_CASE_FAIL, '用例更新失败');
		}
		$this->log('更新用例: ID-' . $this->params['case_id'] . ' ' . $case['name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '用例更新成功');
	}
}
