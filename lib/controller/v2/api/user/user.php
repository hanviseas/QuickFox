<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取用户信息
 */
class Controller_V2_Api_User_User extends Controller_V2_Api_User_Base
{
	protected $request_params = array(
		'user_id' => 'int'
	);

	public function act()
	{
		$this->init_param(Const_Code::USER_PARAM_ERROR, '用户传递参数错误');
		if (!$this->params['user_id']) { // 无参数传入时代表获取自己的信息
			$this->params['user_id'] = $_SESSION['userid'];
		}
		if ($_SESSION['userrole'] !== 'admin' && $_SESSION['userid'] !== $this->params['user_id']) { // 非Admin角色只能访问自己的信息
			$this->return_403(Const_Code::AUTH, '无权访问资源');
		}
		$user = LF\M('V2.User')->get_by_id($this->params['user_id']);
		if (!$user) { // 未找到用户返回400
			$this->return_404(Const_Code::USER_NOT_FOUND, '用户未找到');
		}
		$user['auth'] = LF\lb_read_config('auth', $user['role']); // 附带权限表
		unset($user['passwd']); // 关键数据脱敏
		$this->set_json_response($user);
	}
}
