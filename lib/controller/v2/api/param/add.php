<?php

use Lazybug\Framework as LF;

/**
 * Controller 添加参数
 */
class Controller_V2_Api_Param_Add extends Controller_V2_Api_Param_Base
{
	protected $request_params = array(
		'environment_id' => 'int',
		'param_keyword' => 'string',
		'param_value' => 'string',
		'param_comment' => 'string'
	);

	protected $required_params = array(
		'environment_id',
		'param_keyword'
	);

	public function act()
	{
		$this->init_param(Const_Code::PARAM_PARAM_ERROR, '参数传递参数错误');
		// 关键字必须由数字、字母、下划线组成
		if (!preg_match('/^\w+$/', $this->params['param_keyword'])) {
			$this->return_400(Const_Code::PARAM_FORMAT_ERROR, '参数关键字格式错误');
			return;
		}
		// 关键字在环境范围内唯一，如果重复返回400
		if (LF\M('V2.Environment.Param')->is_keyword_exists_in_environment($this->params['environment_id'], $this->params['param_keyword'])) {
			$this->return_400(Const_Code::ADD_PARAM_EXISTS, '参数关键字重复');
		}
		// 添加参数
		LF\M('V2.Environment.Param')->add(array(
			'environment_id' => $this->params['environment_id'],
			'keyword' => $this->params['param_keyword'],
			'value' => $this->params['param_value'],
			'comment' => $this->params['param_comment']
		));
		// 取回插入的接口ID，用以回载到页面
		$param_id = LF\M('V2.Environment.Param')->is_keyword_exists_in_environment($this->params['environment_id'], $this->params['param_keyword']);
		if (!$param_id) { // 未找到ID返回400
			$this->return_400(Const_Code::ADD_PARAM_FAIL, '参数添加失败');
		}
		$this->log('添加参数: ID-' . $param_id . ' ' . $this->params['param_keyword']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, $param_id);
	}
}
