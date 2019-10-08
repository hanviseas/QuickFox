<?php

use Lazybug\Framework as LF;

/**
 * Controller 删除用户
 */
class Controller_V2_Api_User_Remove extends Controller_V2_Api_User_Base
{
	protected $request_params = array(
		'user_id' => 'int'
	);

	protected $required_params = array(
		'user_id'
	);

	public function act()
	{
		$this->init_param(Const_Code::USER_PARAM_ERROR, '用户传递参数错误');
		$user = LF\M('V2.User')->get_by_id($this->params['user_id']);
		if (!$user) { // 未找到用户返回400
			$this->return_404(Const_Code::USER_NOT_FOUND, '用户未找到');
		}
		if ($this->params['user_id'] === 1) { // admin默认帐号禁止删除
			$this->return_400(Const_Code::USER_PARAM_ERROR, 'admin帐号不能删除');
		}
		LF\M('V2.User')->remove_by_id($this->params['user_id']);
		// 尝试取回数据，如果取回成功返回400
		if (LF\M('V2.User')->get_by_id($this->params['user_id'])) {
			$this->return_400(Const_Code::DELETE_USER_FAIL, '用户删除失败');
		}
		$this->log('删除用户: ID-' . $this->params['user_id'] . ' ' . $user['name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '用户删除成功');
	}
}
