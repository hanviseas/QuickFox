<?php

use Lazybug\Framework as LF;

/**
 * Controller 删除任务
 */
class Controller_V2_Api_Task_Remove extends Controller_V2_Api_Task_Base
{
	protected $request_params = array(
		'task_id' => 'int'
	);

	protected $required_params = array(
		'task_id'
	);

	public function act()
	{
		$this->init_param(Const_Code::TASK_PARAM_ERROR, '任务传递参数错误');
		if ($this->params['task_id'] === 1 && LF\lb_read_system('demo') === true) {
			$this->return_400(Const_Code::TASK_PARAM_ERROR, '演示模式下内置任务不能删除');
		}
		$task = LF\M('V2.Task')->get_by_id($this->params['task_id']);
		if (!$task) { // 未找到任务返回400
			$this->return_404(Const_Code::TASK_NOT_FOUND, '任务未找到');
		}
		LF\M('V2.Task')->remove_by_id($this->params['task_id']);
		// 尝试取回数据，如果取回成功返回400
		if (LF\M('V2.Task')->get_by_id($this->params['task_id'])) {
			$this->return_400(Const_Code::DELETE_TASK_FAIL, '任务删除失败');
		}
		$this->log('删除任务: ID-' . $this->params['task_id'] . ' ' . $task['name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '任务删除成功');
	}
}
