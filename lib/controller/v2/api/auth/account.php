<?php

use Lazybug\Framework as LF;

/**
 * Controller 帐号授权接口
 */
class Controller_V2_Api_Auth_Account extends Controller_V2_Api_Auth_Base
{
	protected $request_params = array(
		'username' => 'string',
		'password' => 'string',
		'save' => 'int'
	);

	protected $required_params = array(
		'username',
		'password'
	);

	public function act()
	{
		$this->init_param(Const_Code::LOGIN_PARAM_ERROR, '登录传递参数错误');
		// 授权校验，校验失败返回400
		$user_id = LF\M('V2.User')->is_password_match($this->params['username'], md5($this->params['username'] . $this->params['password']));
		if (!$user_id) {
			$this->return_400(Const_Code::LOGIN_FAIL, '授权失败');
		}
		$user = LF\M('V2.User')->get_by_id($user_id);
		$_SESSION['userid'] = $user_id;
		$_SESSION['username'] = $user['name'];
		$_SESSION['userrole'] = $user['role'];
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '授权通过');
	}
}
