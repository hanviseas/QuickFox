<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取系统信息
 */
class Controller_V2_Api_System_System extends Controller_V2_Api_System_Base
{

	public function act()
	{
		$system = LF\M('V2.System')->get_one_row();
		if (!$system) { // 未找到用户返回400
			$this->return_404(Const_Code::SYSTEM_NOT_FOUND, '系统设置未找到');
		}
		$user = LF\M('V2.User')->get_by_id($system['default_owner']);
		if ($user) {
			$system['default_owner_avatar'] = $user['avatar'];
			$system['default_owner_name'] = $user['card'];
		} else {
			$system['default_owner_avatar'] = '/static/img/v2/public/default-avatar.png';
			$system['default_owner_name'] = '未指派';
		}
		$this->set_json_response($system);
	}
}
