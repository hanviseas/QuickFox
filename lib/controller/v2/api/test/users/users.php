<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取测试用户
 */
class Controller_V2_Api_Test_Users_Users extends Controller_V2_Api_Test_Base
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
			$order_field = in_array($this->params['order_field'], array('id', 'name', 'card', 'role', 'email')) ? $this->params['order_field'] : 'id';
			$order_type = in_array($this->params['order_type'], array('asc', 'desc')) ? $this->params['order_type'] : 'asc';
			$order = array($order_field => $order_type);
		}
		if ($this->params['page'] && $this->params['size']) {
			$users = LF\M('V2.User')->get_collection_with_total($this->params['page'], $this->params['size'], $where, $order);
		} else {
			$users = LF\M('V2.User')->get_collection($where, $order);
		}
		$this->set_json_response($users);
	}
}
