<?php

use Lazybug\Framework as LF;
use Lazybug\Framework\Util_Server_Request as Request;

/**
 * Controller Teambition授权信息
 */
class Controller_V2_Api_Third_Teambition extends Controller_V2_Api_Base
{
	protected $request_params = array(
		'user_id' => 'int',
	);

	public function act()
	{
		$this->init_param();
		$teambition = LF\M('V2.Third.Teambition')->get_by_user($this->params['user_id']);
		if (!$teambition) { // 未找到应用返回400
			$this->return_404(Const_Code::THIRD_NOT_FOUND, '第三方未找到');
		}
		$this->set_json_response($teambition);
	}
}
