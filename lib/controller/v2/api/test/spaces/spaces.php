<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取测试空间
 */
class Controller_V2_Api_Test_Spaces_Spaces extends Controller_V2_Api_Test_Base
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
			$spaces = LF\M('V2.Space')->get_collection_with_total($this->params['page'], $this->params['size'], $where, $order);
		} else {
			$spaces = LF\M('V2.Space')->get_collection($where, $order);
		}
		// 数据集兼容
		if (isset($spaces['collection'])) {
			$collection = &$spaces['collection'];
		} else {
			$collection = &$spaces;
		}
		// 补充数据
		$system = LF\M('V2.System')->get_one_row();
		array_unshift($collection, array( // 插入默认空间
			'id' => 0,
			'name' => '默认空间',
			'owner_id' => $system ? $system['default_owner'] : 0
		));
		foreach ($collection as &$space) {
			if ((int) $space['owner_id'] === 0) {
				$user = null;
			} else {
				$user = LF\M('V2.User')->get_by_id((int) $space['owner_id']);
			}
			if ($user) {
				$space['owner_avatar'] = $user['avatar'];
				$space['owner_name'] = $user['card'];
			} else {
				$space['owner_avatar'] = '/static/img/v2/public/default-avatar.png';
				$space['owner_name'] = '未指派';
			}
		}
		$this->set_json_response($spaces);
	}
}
