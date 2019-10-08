<?php

use Lazybug\Framework as LF;
use Lazybug\Framework\Util_Client_Cookie as Cookie;

/**
 * Controller 添加Cookie
 */
class Controller_V2_Api_Cookie_Add extends Controller_V2_Api_Cookie_Base
{
	protected $request_params = array(
		'cookie_key' => 'string',
		'cookie_value' => 'string',
		'expire_time' => 'int'
	);

	protected $required_params = array(
		'cookie_key',
		'cookie_value'
	);

	public function act()
	{
		$this->init_param(Const_Code::ERROR, '请求参数错误');
		Cookie::set_cookie($this->params['cookie_key'], $this->params['cookie_value'], $this->params['expire_time']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '设置Cookie成功');
	}
}
