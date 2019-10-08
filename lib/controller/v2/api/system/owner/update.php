<?php

use Lazybug\Framework as LF;

/**
 * Controller 设置系统默认维护人
 */
class Controller_V2_Api_System_Owner_Update extends Controller_V2_Api_System_Base
{
	protected $request_params = array(
		'default_owner_id' => 'int',
	);

	protected $required_params = array(
		'default_owner_id',
	);

	public function act()
	{
		$this->init_param(Const_Code::SYSTEM_PARAM_ERROR, '系统传递参数错误');
		// 更新系统默认维护人
		$return = LF\M('V2.System')->modify(array(), array(
			'default_owner' => $this->params['default_owner_id'],
		));
		if (is_null($return)) { // 无更新返回400
			$this->return_400(Const_Code::UPDATE_SYSTEM_FAIL, '系统默认维护人更新失败');
		}
		$this->log('更新系统默认维护人');
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '系统默认维护人更新成功');
	}
}
