<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取空间接口
 */
class Controller_V2_Api_Space_Items_Items extends Controller_V2_Api_Space_Base
{
	protected $request_params = array(
		'page' => 'int',
		'size' => 'int',
		'space_id' => 'int',
		'module_id' => 'int',
		'keyword' => 'string',
		'order_field' => 'string',
		'order_type' => 'string'
	);

	public function act()
	{
		$this->init_param();
		if ($this->params['space_id'] !== 0 && !LF\M('V2.Space')->get_by_id($this->params['space_id'])) { // 未找到空间返回400
			$this->return_404(Const_Code::SPACE_NOT_FOUND, '空间未找到');
		}
		// 如果有传递关键词参数，则在名称和请求地址中查找
		$where = array();
		if ($this->params['keyword'] !== '') {
			$where = array(
				'_complex' => array(
					'_logic' => 'or',
					'name' => array(
						'like', '%' . $this->params['keyword'] . '%'
					),
					'url' => array(
						'like', '%' . $this->params['keyword'] . '%'
					)
				)
			);
		}
		// 如果有传递排序方式，则进行数据排序
		$order = array();
		if ($this->params['order_field'] !== '') {
			$order_field = in_array($this->params['order_field'], array('id', 'name', 'url')) ? $this->params['order_field'] : 'id';
			$order_type = in_array($this->params['order_type'], array('asc', 'desc')) ? $this->params['order_type'] : 'asc';
			$order = array($order_field => $order_type);
		}
		// 如果模块ID为-1，代表取回空间全部接口，否则取回对应模块ID的接口
		if ($this->params['module_id'] > 0) {
			$items = LF\M('V2.Space.Item')->get_by_module($this->params['module_id'], $this->params['page'], $this->params['size'], $where, $order);
		} else if ($this->params['module_id'] === 0) {
			$items = LF\M('V2.Space.Item')->get_by_unset_module($this->params['space_id'], $this->params['page'], $this->params['size'], $where, $order);
		} else {
			$items = LF\M('V2.Space.Item')->get_by_space($this->params['space_id'], $this->params['page'], $this->params['size'], $where, $order);
		}
		// 数据集兼容
		if (isset($items['collection'])) {
			$collection = &$items['collection'];
		} else {
			$collection = &$items;
		}
		// 补充数据
		foreach ($collection as &$item) {
			if ((int) $item['owner_id'] === 0) {
				$user = null;
			} else {
				$user = LF\M('V2.User')->get_by_id((int) $item['owner_id']);
			}
			if ($user) {
				$item['owner_avatar'] = $user['avatar'];
				$item['owner_name'] = $user['card'];
			} else {
				$item['owner_avatar'] = '/static/img/v2/public/default-avatar.png';
				$item['owner_name'] = '未指派';
			}
		}
		$this->set_json_response($items);
	}
}
