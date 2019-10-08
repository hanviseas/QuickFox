<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取接入应用
 */
class Controller_V2_Api_Test_Applications_Applications extends Controller_V2_Api_Test_Base
{
	protected $request_params = array(
		'page' => 'int',
		'size' => 'int',
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
					'name' => array(
						'like', '%' . $this->params['keyword'] . '%'
					)
				)
			);
		}
		// 如果有传递排序方式，则进行数据排序
		$order = array();
		if ($this->params['order_field'] !== '') {
			$order_field = in_array($this->params['order_field'], array('id', 'name')) ? $this->params['order_field'] : 'id';
			$order_type = in_array($this->params['order_type'], array('asc', 'desc')) ? $this->params['order_type'] : 'asc';
			$order = array($order_field => $order_type);
		}
		if ($this->params['page'] && $this->params['size']) {
			$applications = LF\M('V2.Application')->get_collection_with_total($this->params['page'], $this->params['size'], $where, $order);
		} else {
			$applications = LF\M('V2.Application')->get_collection($where, $order);
		}
		// 数据集兼容
		if (isset($applications['collection'])) {
			$collection = &$applications['collection'];
		} else {
			$collection = &$applications;
		}
		// 补充数据
		foreach ($collection as &$application) {
			$application['avatar'] = '/static/img/v2/public/default-app-avatar.png';
			$secrets = explode('-', $application['secret']);
			foreach ($secrets as &$secret) { // 敏感数据脱敏
				$secret = substr_replace($secret, '******', 1, -1);
			}
			$application['secret'] = implode('-', $secrets);
		}
		$this->set_json_response($applications);
	}
}
