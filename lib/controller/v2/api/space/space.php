<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取空间信息
 */
class Controller_V2_Api_Space_Space extends Controller_V2_Api_Space_Base
{
	protected $request_params = array(
		'space_id' => 'int'
	);

	public function act()
	{
		$this->init_param();
		if ($this->params['space_id'] === 0) { // 默认空间
			$system = LF\M('V2.System')->get_one_row();
			$space = array(
				'id' => 0,
				'name' => '默认空间',
				'owner_id' => $system ? $system['default_owner'] : 0
			);
		} else {
			$space = LF\M('V2.Space')->get_by_id($this->params['space_id']);
		}
		if (!$space) { // 未找到空间返回400
			$this->return_404(Const_Code::SPACE_NOT_FOUND, '空间未找到');
		}
		// 补充数据
		$user = LF\M('V2.User')->get_by_id((int) $space['owner_id']);
		if ($user) {
			$space['owner_avatar'] = $user['avatar'];
			$space['owner_name'] = $user['card'];
		} else {
			$space['owner_avatar'] = '/static/img/v2/public/default-avatar.png';
			$space['owner_name'] = '未指派';
		}
		$this->set_json_response($space);
	}
}
