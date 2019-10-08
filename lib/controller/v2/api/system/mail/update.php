<?php

use Lazybug\Framework as LF;

/**
 * Controller 设置系统邮件
 */
class Controller_V2_Api_System_Mail_Update extends Controller_V2_Api_System_Base
{
	protected $request_params = array(
		'smtp_server' => 'string',
		'smtp_port' => 'int',
		'smtp_user' => 'string',
		'smtp_password' => 'string',
		'smtp_ssl' => 'int',
		'smtp_default_port' => 'int',
		'mail_list' => 'string'
	);

	protected $required_params = array(
		'smtp_server',
		'smtp_port'
	);

	public function act()
	{
		$this->init_param(Const_Code::SYSTEM_PARAM_ERROR, '系统传递参数错误');
		// 更新系统邮件
		$return = LF\M('V2.System')->modify(array(), array(
			'smtp_server' => $this->params['smtp_server'],
			'smtp_port' => $this->params['smtp_port'],
			'smtp_user' => $this->params['smtp_user'],
			'smtp_password' => $this->params['smtp_password'],
			'smtp_ssl' => $this->params['smtp_ssl'],
			'smtp_default_port' => $this->params['smtp_default_port'],
			'mail_list' => $this->params['mail_list']
		));
		if (is_null($return)) { // 无更新返回400
			$this->return_400(Const_Code::UPDATE_SYSTEM_FAIL, '系统邮件更新失败');
		}
		$this->log('更新系统邮件');
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '系统邮件更新成功');
	}
}
