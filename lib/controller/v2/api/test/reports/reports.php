<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取测试报告
 */
class Controller_V2_Api_Test_Reports_Reports extends Controller_V2_Api_Test_Base
{
	protected $request_params = array(
		'task_id' => 'int',
		'page' => 'int',
		'size' => 'int',
		'order_field' => 'string',
		'order_type' => 'string'
	);

	public function act()
	{
		$this->init_param();
		// 如果有传递排序方式，则进行数据排序
		$order = array();
		if ($this->params['order_field'] !== '') {
			$order_field = in_array($this->params['order_field'], array('id', 'name', 'url')) ? $this->params['order_field'] : 'id';
			$order_type = in_array($this->params['order_type'], array('asc', 'desc')) ? $this->params['order_type'] : 'asc';
			$order = array($order_field => $order_type);
		}
		// 如果任务ID为0，代表取回全部报告，否则取回对应任务ID的报告
		if ($this->params['task_id']) {
			$reports = LF\M('V2.Report')->get_by_task($this->params['task_id'], $this->params['page'], $this->params['size'], array(), $order);
		} else {
			if ($this->params['page'] && $this->params['size']) {
				$reports = LF\M('V2.Report')->get_collection_with_total($this->params['page'], $this->params['size'], array(), $order);
			} else {
				$reports = LF\M('V2.Report')->get_collection(array(), $order);
			}
		}
		// 数据集兼容
		if (isset($reports['collection'])) {
			$collection = &$reports['collection'];
		} else {
			$collection = &$reports;
		}
		// 补充数据
		foreach ($collection as &$report) {
			$task = LF\M('V2.Task')->get_by_id((int) $report['task_id']);
			$report['task_name'] = $task ? $task['name'] : '未知任务';
		}
		$this->set_json_response($reports);
	}
}
