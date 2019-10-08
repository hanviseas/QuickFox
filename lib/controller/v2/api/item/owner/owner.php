<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取接口维护人
 */
class Controller_V2_Api_Item_Owner_Owner extends Controller_V2_Api_Item_Base
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
		$item_owner = $this->get_item_owner($item);
		// 补充数据
		$user = LF\M('V2.User')->get_by_id($item_owner['id']);
		if ($user) {
			$item_owner['avatar'] = $user['avatar'];
			$item_owner['name'] = $user['card'];
		} else {
			$item_owner['avatar'] = '/static/img/v2/public/default-avatar.png';
			$item_owner['name'] = '未指派';
		}
		$this->set_json_response($item_owner);
	}
}
