<?php

use Lazybug\Framework as LF;

/**
 * Controller 添加步骤
 */
class Controller_V2_Api_Step_Add extends Controller_V2_Api_Step_Base
{
	protected $request_params = array(
		'case_id' => 'int',
		'step_name' => 'string',
		'step_type' => 'string',
		'step_command' => 'string',
		'preposition_fliter' => 'string',
		'postposition_fliter' => 'string',
		'step_value' => 'string',
		'step_sequence' => 'int'
	);

	protected $required_params = array(
		'case_id',
		'step_name',
		'step_type',
		'step_value',
		'step_sequence'
	);

	public function act()
	{
		$this->init_param(Const_Code::STEP_PARAM_ERROR, '步骤传递参数错误');
		if ($this->params['case_id'] <= 3 && LF\lb_read_system('demo') === true) {
			$this->return_400(Const_Code::STEP_PARAM_ERROR, '演示模式下内置用例步骤不能修改');
		}
		// 添加步骤
		LF\M('V2.Space.Step')->add(array(
			'case_id' => $this->params['case_id'],
			'name' => $this->params['step_name'],
			'type' => $this->params['step_type'],
			'command' => $this->params['step_command'],
			'preposition_fliter' => $this->params['preposition_fliter'],
			'postposition_fliter' => $this->params['postposition_fliter'],
			'value' => $this->params['step_value'],
			'sequence' => $this->params['step_sequence']
		));
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '步骤添加成功');
	}
}
