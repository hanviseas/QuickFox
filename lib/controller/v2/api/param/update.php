<?php

use Lazybug\Framework as LF;

/**
 * Controller 更新参数
 */
class Controller_V2_Api_Param_Update extends Controller_V2_Api_Param_Base
{
	protected $request_params = array(
		'param_id' => 'int',
		'param_keyword' => 'string',
		'param_value' => 'string',
		'param_comment' => 'string'
	);

	protected $required_params = array(
		'param_id',
		'param_keyword'
	);

	public function act()
	{
		$this->init_param(Const_Code::PARAM_PARAM_ERROR, '参数传递参数错误');
		if ($this->params['param_id'] === 1 && LF\lb_read_system('demo') === true) {
			$this->return_400(Const_Code::PARAM_PARAM_ERROR, '演示模式下内置参数不能修改');
		}
		$param = LF\M('V2.Environment.Param')->get_by_id($this->params['param_id']);
		if (!$param) { // 未找到参数返回400
			$this->return_404(Const_Code::PARAM_NOT_FOUND, '参数未找到');
		}
		// 关键字必须由数字、字母、下划线组成
		if (!preg_match('/^\w+$/', $this->params['param_keyword'])) {
			$this->return_400(Const_Code::PARAM_FORMAT_ERROR, '参数关键字格式错误');
			return;
		}
		// 关键字在环境范围内唯一，如果重复返回400
		if (LF\M('V2.Environment.Param')->is_keyword_exists_in_environment((int) $param['environment_id'], $this->params['param_keyword'], $this->params['param_id'])) {
			$this->return_400(Const_Code::UPDATE_PARAM_EXISTS, '参数关键字重复');
		}
		// 更新参数
		$return = LF\M('V2.Environment.Param')->modify_by_id($this->params['param_id'], array(
			'keyword' => $this->params['param_keyword'],
			'value' => $this->params['param_value'],
			'comment' => $this->params['param_comment']
		));
		if (is_null($return)) { // 无更新返回400
			$this->return_400(Const_Code::UPDATE_PARAM_FAIL, '参数更新失败');
		}
		$this->log('更新参数: ID-' . $this->params['param_id'] . ' ' . $param['keyword']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '参数更新成功');
	}
}
