<?php

use Lazybug\Framework as LF;

/**
 * Controller 添加任务
 */
class Controller_V2_Api_Task_Add extends Controller_V2_Api_Task_Base
{
	protected $request_params = array(
		'task_name' => 'string',
		'environment_id' => 'int',
		'space_id' => 'int',
		'module_id' => 'int',
		'test_level' => 'int',
		'test_runtime' => 'string',
		'preposition_script' => 'string',
		'postposition_script' => 'string'
	);

	protected $required_params = array(
		'task_name',
		'environment_id',
		'space_id',
		'module_id',
		'test_level',
		'test_runtime'
	);

	public function act()
	{
		$this->init_param(Const_Code::TASK_PARAM_ERROR, '任务传递参数错误');
		// 名称在全局范围内唯一，如果重复返回400
		if (LF\M('V2.Task')->is_name_exists($this->params['task_name'])) {
			$this->return_400(Const_Code::ADD_TASK_EXISTS, '任务名称重复');
		}
		// 添加空间
		LF\M('V2.Task')->add(array(
			'name' => $this->params['task_name'],
			'environment_id' => $this->params['environment_id'],
			'space_id' => $this->params['space_id'],
			'module_id' => $this->params['module_id'],
			'level' => $this->params['test_level'],
			'runtime' => $this->params['test_runtime'],
			'preposition_script' => $this->params['preposition_script'],
			'postposition_script' => $this->params['postposition_script']
		));
		// 取回插入的任务ID，用以回载到页面
		$task_id = LF\M('V2.Task')->is_name_exists($this->params['task_name']);
		if (!$task_id) { // 未找到ID返回400
			$this->return_400(Const_Code::ADD_TASK_FAIL, '任务添加失败');
		}
		$this->log('添加任务: ID-' . $task_id . ' ' . $this->params['task_name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, $task_id);
	}
}
