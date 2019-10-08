<?php

use Lazybug\Framework as LF;

/**
 * Controller 删除作业
 */
class Controller_V2_Api_Job_Remove extends Controller_V2_Api_Job_Base
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
		LF\M('V2.Task.Job')->remove_by_task($this->params['task_id']);
		// 尝试取回数据，如果取回成功返回400
		if (LF\M('V2.Task.Job')->get_by_task($this->params['task_id'])) {
			$this->return_400(Const_Code::DELETE_JOB_FAIL, '作业删除失败');
		}
		$this->log('删除作业: ID-' . $this->params['task_id']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '作业删除成功');
	}
}
