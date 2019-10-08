<?php

use Lazybug\Framework as LF;

/**
 * Controller 设置用户密码
 */
class Controller_V2_Api_User_Password_Update extends Controller_V2_Api_User_Base
{
	protected $request_params = array(
		'old_password' => 'string',
		'new_password' => 'string'
	);

	protected $required_params = array(
		'old_password',
		'new_password'
	);

	public function act()
	{
		$this->init_param(Const_Code::USER_PARAM_ERROR, '用户传递参数错误');
		if ($_SESSION['userid'] === 1 && LF\lb_read_system('demo') === true) {
			$this->return_400(Const_Code::USER_PARAM_ERROR, '演示模式下禁止修改管理员密码');
		}
		$user = LF\M('V2.User')->get_by_id((int) $_SESSION['userid']);
		if (!$user) { // 未找到用户返回400
			$this->return_404(Const_Code::USER_NOT_FOUND, '用户未找到');
		}
		// 原密码校验失败，返回400
		if (md5($_SESSION['username'] . $this->params['old_password']) !== $user['passwd']) {
			$this->return_400(Const_Code::USER_CHECK_ERROR, '用户密码校验失败');
		}
		// 更新用户
		$return = LF\M('V2.User')->set_my_password((int) $_SESSION['userid'], md5($_SESSION['username'] . $this->params['new_password']));
		if (is_null($return)) { // 无更新返回400
			$this->return_400(Const_Code::UPDATE_USER_FAIL, '用户密码更新失败');
		}
		$this->log('更新用户密码: ID-' . $_SESSION['userid'] . ' ' . $_SESSION['username']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '用户密码更新成功');
	}
}
