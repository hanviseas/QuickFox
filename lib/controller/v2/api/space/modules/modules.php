<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取空间模块
 */
class Controller_V2_Api_Space_Modules_Modules extends Controller_V2_Api_Space_Base
{
	protected $request_params = array(
		'page' => 'int',
		'size' => 'int',
		'space_id' => 'int'
	);

	public function act()
	{
		$this->init_param();
		if ($this->params['space_id'] !== 0 && !LF\M('V2.Space')->get_by_id($this->params['space_id'])) { // 未找到空间返回400
			$this->return_404(Const_Code::SPACE_NOT_FOUND, '空间未找到');
		}
		$modules = LF\M('V2.Space.Module')->get_by_space($this->params['space_id'], $this->params['page'], $this->params['size']);
		// 数据集兼容
		if (isset($modules['collection'])) {
			$collection = &$modules['collection'];
		} else {
			$collection = &$modules;
		}
		// 补充数据
		foreach ($collection as &$module) {
			if ((int) $module['owner_id'] === 0) {
				$user = null;
			} else {
				$user = LF\M('V2.User')->get_by_id((int) $module['owner_id']);
			}
			if ($user) {
				$module['owner_avatar'] = $user['avatar'];
				$module['owner_name'] = $user['card'];
			} else {
				$module['owner_avatar'] = '/static/img/v2/public/default-avatar.png';
				$module['owner_name'] = '未指派';
			}
		}
		$this->set_json_response($modules);
	}
}
