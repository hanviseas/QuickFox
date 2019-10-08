<?php

use Lazybug\Framework as LF;

/**
 * Controller 设置任务挂起状态
 */
class Controller_V2_Api_Task_Suspension_Update extends Controller_V2_Api_Task_Base
{
	protected $request_params = array(
		'task_id' => 'int',
		'task_suspension' => 'int'
	);

	protected $required_params = array(
		'task_id',
		'task_suspension'
	);

	public function act()
	{
		$this->init_param(Const_Code::TASK_PARAM_ERROR, '任务传递参数错误');
		$task = LF\M('V2.Task')->get_by_id($this->params['task_id']);
		if (!$task) { // 未找到任务返回400
			$this->return_404(Const_Code::TASK_NOT_FOUND, '任务未找到');
		}
		// 更新任务
		$return = LF\M('V2.Task')->set_my_suspension($this->params['task_id'], $this->params['task_suspension']);
		if (is_null($return)) { // 无更新返回400
			$this->return_400(Const_Code::UPDATE_TASK_FAIL, '任务挂起状态更新失败');
		}
		$this->log('更新任务挂起状态: ID-' . $this->params['task_id'] . ' ' . $task['name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '任务挂起状态更新成功');
	}
}
