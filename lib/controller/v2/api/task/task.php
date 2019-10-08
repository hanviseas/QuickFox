<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取任务信息
 */
class Controller_V2_Api_Task_Task extends Controller_V2_Api_Task_Base
{
	protected $request_params = array(
		'task_id' => 'int'
	);

	public function act()
	{
		$this->init_param();
		$task = LF\M('V2.Task')->get_by_id($this->params['task_id']);
		if (!$task) { // 未找到用户返回400
			$this->return_404(Const_Code::TASK_NOT_FOUND, '任务未找到');
		}
		// 补充数据
		$environment = LF\M('V2.Environment')->get_by_id((int) $task['environment_id']);
		$task['environment_name'] = $environment ? $environment['name'] : '默认配置';
		$space = LF\M('V2.Space')->get_by_id((int) $task['space_id']);
		$task['space_name'] = $space ? $space['name'] : '默认空间';
		$module = LF\M('V2.Space.Module')->get_by_id((int) $task['module_id']);
		$task['module_name'] = $module ? $module['name'] : '全部模块';
		$this->set_json_response($task);
	}
}
