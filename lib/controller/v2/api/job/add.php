<?php

use Lazybug\Framework as LF;

/**
 * Controller 添加作业
 */
class Controller_V2_Api_Job_Add extends Controller_V2_Api_Job_Base
{
	protected $request_params = array(
		'task_id' => 'int'
	);

	protected $required_params = array(
		'task_id'
	);

	public function act()
	{
		$this->init_param(Const_Code::JOB_PARAM_ERROR, '作业传递参数错误');
		// 相同任务只能有一个作业在运行，如果重复返回400
		if (LF\M('V2.Task.Job')->is_task_exists($this->params['task_id'])) {
			$this->return_400(Const_Code::ADD_JOB_EXISTS, '任务已在队列');
		}
		// 添加作业
		LF\M('V2.Task.Job')->add(array(
			'task_id' => $this->params['task_id'],
			'guid' => $this->params['task_id'] . 'G' . date('YmdHis') . rand(1000, 9999)
		));
		// 取回插入的任务ID
		$task_id = LF\M('V2.Task.Job')->is_task_exists($this->params['task_id']);
		if (!$task_id) { // 未找到ID返回400
			$this->return_400(Const_Code::ADD_JOB_FAIL, '作业添加失败');
		}
		$this->log('添加作业: ID-' . $task_id);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, $task_id);
	}
}
