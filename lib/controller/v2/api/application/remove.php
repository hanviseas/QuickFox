<?php

use Lazybug\Framework as LF;

/**
 * Controller 删除应用
 */
class Controller_V2_Api_Application_Remove extends Controller_V2_Api_Application_Base
{
	protected $request_params = array(
		'application_id' => 'int'
	);

	protected $required_params = array(
		'application_id'
	);

	public function act()
	{
		$this->init_param(Const_Code::APPLICATION_PARAM_ERROR, '应用传递参数错误');
		$application = LF\M('V2.Application')->get_by_id($this->params['application_id']);
		if (!$application) { // 未找到应用返回400
			$this->return_404(Const_Code::APPLICATION_NOT_FOUND, '应用未找到');
		}
		LF\M('V2.Application')->remove_by_id($this->params['application_id']);
		// 尝试取回数据，如果取回成功返回400
		if (LF\M('V2.Application')->get_by_id($this->params['application_id'])) {
			$this->return_400(Const_Code::DELETE_APPLICATION_FAIL, '应用删除失败');
		}
		$this->log('删除应用: ID-' . $this->params['application_id'] . ' ' . $application['name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '应用删除成功');
	}
}
