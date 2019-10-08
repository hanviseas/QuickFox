<?php

use Lazybug\Framework as LF;

/**
 * Controller 更新用户
 */
class Controller_V2_Api_User_Update extends Controller_V2_Api_User_Base
{
	protected $request_params = array(
		'user_id' => 'int',
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
		'user_role',
		'user_avatar'
	);

	public function act()
	{
		$this->init_param(Const_Code::USER_PARAM_ERROR, '用户传递参数错误');
		if (!$this->params['user_id']) { // 无参数传入时代表修改自己的信息
			$this->params['user_id'] = $_SESSION['userid'];
		}
		if ($this->params['user_id'] === 1 && LF\lb_read_system('demo') === true) {
			$this->return_400(Const_Code::USER_PARAM_ERROR, '演示模式下禁止修改管理员信息');
		}
		if ($_SESSION['userrole'] !== 'admin' && $_SESSION['userid'] !== $this->params['user_id']) { // 非Admin角色只能修改自己的信息
			$this->return_403(Const_Code::AUTH, '无权访问资源');
		}
		$user = LF\M('V2.User')->get_by_id($this->params['user_id']);
		if (!$user) { // 未找到用户返回400
			$this->return_404(Const_Code::USER_NOT_FOUND, '用户未找到');
		}
		// 用户名必须由数字、字母、下划线组成
		if (!preg_match('/^\w+$/', $this->params['user_name'])) {
			$this->return_400(Const_Code::USER_FORMAT_ERROR, '用户名称格式错误');
		}
		// 名称在全局范围内唯一，如果重复返回400
		if (LF\M('V2.User')->is_name_exists($this->params['user_name'], $this->params['user_id'])) {
			$this->return_400(Const_Code::ADD_USER_EXISTS, '用户名称重复');
		}
		// 根据是否传递password参数决定是否更改密码
		if ($this->params['user_password'] !== '') {
			$update = array(
				'card' => $this->params['user_card'],
				'passwd' => md5($this->params['user_name'] . $this->params['user_password']), // 与用户名md5后存储到数据库
				'role' => $this->params['user_role'],
				'avatar' => $this->params['user_avatar'],
				'email' => $this->params['user_email']
			);
		} else {
			$update = array(
				'card' => $this->params['user_card'],
				'role' => $this->params['user_role'],
				'avatar' => $this->params['user_avatar'],
				'email' => $this->params['user_email']
			);
		}
		if ($_SESSION['userrole'] !== 'admin') { // 非Admin角色无法修改特定信息
			unset($update['role']);
		}
		// 更新用户
		$return = LF\M('V2.User')->modify_by_id($this->params['user_id'], $update);
		if (is_null($return)) { // 无更新返回400
			$this->return_400(Const_Code::UPDATE_USER_FAIL, '用户更新失败');
		}
		$this->log('更新用户: ID-' . $this->params['user_id'] . ' ' . $user['name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '用户更新成功');
	}
}
