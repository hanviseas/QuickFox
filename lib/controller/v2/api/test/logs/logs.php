<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取操作日志
 */
class Controller_V2_Api_Test_Logs_Logs extends Controller_V2_Api_Test_Base
{
	protected $request_params = array(
		'page' => 'int',
		'size' => 'int',
		'source' => 'string',
		'operator_id' => 'int',
		'keyword' => 'string',
		'order_field' => 'string',
		'order_type' => 'string'
	);

	public function act()
	{
		$this->init_param();
		// 如果有传递关键词参数，则在名称中查找
		$where = array();
		if ($this->params['keyword'] !== '') {
			$where = array(
				'_complex' => array(
					'_logic' => 'or',
					'action' => array(
						'like', '%' . $this->params['keyword'] . '%'
					)
				)
			);
		}
		// 额外查询条件
		if ($this->params['source'] !== 'all') {
			$where['source'] = $this->params['source'];
		}
		if ($this->params['operator_id'] !== -1) {
			$where['operator'] = $this->params['operator_id'];
		}
		// 如果有传递排序方式，则进行数据排序
		$order = array();
		if ($this->params['order_field'] !== '') {
			$order_field = in_array($this->params['order_field'], array('id')) ? $this->params['order_field'] : 'id';
			$order_type = in_array($this->params['order_type'], array('asc', 'desc')) ? $this->params['order_type'] : 'asc';
			$order = array($order_field => $order_type);
		}
		if ($this->params['page'] && $this->params['size']) {
			$logs = LF\M('V2.Log')->get_collection_with_total($this->params['page'], $this->params['size'], $where, $order);
		} else {
			$logs = LF\M('V2.Log')->get_collection($where, $order);
		}
		// 数据集兼容
		if (isset($logs['collection'])) {
			$collection = &$logs['collection'];
		} else {
			$collection = &$logs;
		}
		// 补充数据
		foreach ($collection as &$log) {
			if ($log['source'] === 'user') {
				$user = LF\M('V2.User')->get_by_id((int) $log['operator']);
				$log['operator_name'] = $user ? $user['card'] : $log['operator_name'];
				$log['operator_avatar'] = $user ? $user['avatar'] : '/static/img/v2/public/default-avatar.png';
			} else if ($log['source'] === 'app') {
				$application = LF\M('V2.Application')->get_by_id((int) $log['operator']);
				$log['operator_name'] = $application ? $application['name'] : $log['operator_name'];
				$log['operator_avatar'] = '/static/img/v2/public/default-app-avatar.png';
			}
		}
		$this->set_json_response($logs);
	}
}
