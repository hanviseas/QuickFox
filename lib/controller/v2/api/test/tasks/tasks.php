<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取测试任务
 */
class Controller_V2_Api_Test_Tasks_Tasks extends Controller_V2_Api_Test_Base
{
	protected $request_params = array(
		'page' => 'int',
		'size' => 'int',
		'keyword' => 'string'
	);

	public function act()
	{
		$this->init_param();
		// 如果有传递关键词参数，则在名称和请求地址中查找
		$where = array();
		if ($this->params['keyword'] !== '') {
			$where = array(
				'_complex' => array(
					'_logic' => 'or',
					'name' => array(
						'like', '%' . $this->params['keyword'] . '%'
					)
				)
			);
		}
		if ($this->params['page'] && $this->params['size']) {
			$tasks = LF\M('V2.Task')->get_collection_with_total($this->params['page'], $this->params['size'], $where);
			$collection = &$tasks['collection'];
		} else {
			$tasks = LF\M('V2.Task')->get_collection($where);
			$collection = &$tasks;
		}
		// 补充数据
		foreach ($collection as &$task) {
			$environment = LF\M('V2.Environment')->get_by_id((int) $task['environment_id']);
			$task['environment_name'] = $environment ? $environment['name'] : '默认配置';
			$space = LF\M('V2.Space')->get_by_id((int) $task['space_id']);
			$task['space_name'] = $space ? $space['name'] : '默认空间';
			$module = LF\M('V2.Space.Module')->get_by_id((int) $task['module_id']);
			$task['module_name'] = $module ? $module['name'] : '全部模块';
			$task['report'] = LF\M('V2.Report')->get_last_by_task((int) $task['id']);
			$job = LF\M('V2.Task.Job')->get_by_task((int) $task['id']);
			$task['is_running'] = $job ? 1 : 0; // 如果Job表中有数据，则表示任务正在运行
			$task['test_total_count'] = $job ? (int) $job[0]['total'] : 0; // 总共需要运行的测试统计
			$task['test_current_count'] = $job ? (int) $job[0]['current'] : 0; // 当前已完成的测试统计
		}
		$this->set_json_response($tasks);
	}
}
