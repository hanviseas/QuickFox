<?php

use Lazybug\Framework as LF;

/**
 * Controller 更新任务
 */
class Controller_V2_Api_Task_Update extends Controller_V2_Api_Task_Base
{
	protected $request_params = array(
		'task_id' => 'int',
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
		'task_id',
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
		if ($this->params['task_id'] === 1 && LF\lb_read_system('demo') === true) {
			$this->return_400(Const_Code::TASK_PARAM_ERROR, '演示模式下内置任务不能修改');
		}
		$task = LF\M('V2.Task')->get_by_id($this->params['task_id']);
		if (!$task) { // 未找到任务返回400
			$this->return_404(Const_Code::TASK_NOT_FOUND, '任务未找到');
		}
		// 名称在全局范围内唯一，如果重复返回400
		if (LF\M('V2.Task')->is_name_exists($this->params['task_name'], $this->params['task_id'])) {
			$this->return_400(Const_Code::UPDATE_TASK_EXISTS, '任务名称重复');
		}
		// 更新任务
		$return = LF\M('V2.Task')->modify_by_id($this->params['task_id'], array(
			'name' => $this->params['task_name'],
			'environment_id' => $this->params['environment_id'],
			'space_id' => $this->params['space_id'],
			'module_id' => $this->params['module_id'],
			'level' => $this->params['test_level'],
			'runtime' => $this->params['test_runtime'],
			'preposition_script' => $this->params['preposition_script'],
			'postposition_script' => $this->params['postposition_script']
		));
		if (is_null($return)) { // 无更新返回400
			$this->return_400(Const_Code::UPDATE_TASK_FAIL, '任务更新失败');
		}
		$this->log('更新任务: ID-' . $this->params['task_id'] . ' ' . $task['name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '任务更新成功');
	}
}
