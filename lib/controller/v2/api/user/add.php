<?php

use Lazybug\Framework as LF;

/**
 * Controller 添加用户
 */
class Controller_V2_Api_User_Add extends Controller_V2_Api_User_Base
{
	protected $request_params = array(
		'user_name' => 'string',
		'user_card' => 'string',
		'user_password' => 'string',
		'user_role' => 'string',
		'user_avatar' => 'string',
		'user_email' => 'string'
	);

	protected $required_params = array(
		'user_name',
		'user_card',
		'user_role'
	);

	public function act()
	{
		$this->init_param(Const_Code::USER_PARAM_ERROR, '用户传递参数错误');
		// 用户名必须由数字、字母、下划线组成
		if (!preg_match('/^\w+$/', $this->params['user_name'])) {
			$this->return_400(Const_Code::USER_FORMAT_ERROR, '用户名称格式错误');
		}
		// 名称在全局范围内唯一，如果重复返回400
		if (LF\M('V2.User')->is_name_exists($this->params['user_name'])) {
			$this->return_400(Const_Code::ADD_USER_EXISTS, '用户名称重复');
		}
		$user_password = $this->params['user_password'] !== '' ? $this->params['user_password'] : 'quickfox'; // 默认密码quickfox
		LF\M('V2.User')->add(array(
			'name' => $this->params['user_name'],
			'card' => $this->params['user_card'],
			'passwd' => md5($this->params['user_name'] . $user_password), // 与用户名md5后存储到数据库
			'role' => $this->params['user_role'],
			'avatar' => $this->params['user_avatar'],
			'email' => $this->params['user_email']
		));
		// 取回插入的用户ID，用以回载到页面
		$user_id = LF\M('V2.User')->is_name_exists($this->params['user_name']);
		if (!$user_id) { // 未找到ID返回400
			$this->return_400(Const_Code::ADD_USER_FAIL, '用户添加失败');
		}
		$this->log('添加用户: ID-' . $user_id . ' ' . $this->params['user_name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, $user_id);
	}
}
