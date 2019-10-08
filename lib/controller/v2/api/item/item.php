<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取接口信息
 */
class Controller_V2_Api_Item_Item extends Controller_V2_Api_Item_Base
{
	protected $request_params = array(
		'item_id' => 'int'
	);

	public function act()
	{
		$this->init_param();
		$item = LF\M('V2.Space.Item')->get_by_id($this->params['item_id']);
		if (!$item) { // 未找到接口返回400
			$this->return_404(Const_Code::ITEM_NOT_FOUND, '接口未找到');
		}
		// 补充数据
		$item_owner = $this->get_item_owner($item);
		$item['owner_id'] = $item_owner['id'];
		$item['owner_source'] = $item_owner['source'];
		$user = LF\M('V2.User')->get_by_id($item['owner_id']);
		if ($user) {
			$item['owner_avatar'] = $user['avatar'];
			$item['owner_name'] = $user['card'];
		} else {
			$item['owner_avatar'] = '/static/img/v2/public/default-avatar.png';
			$item['owner_name'] = '未指派';
		}
		$this->set_json_response($item);
	}
}
