<?php

use Lazybug\Framework as LF;

/**
 * Controller 添加应用
 */
class Controller_V2_Api_Application_Add extends Controller_V2_Api_Application_Base
{
	protected $request_params = array(
		'application_name' => 'string',
		'application_secret' => 'string'
	);

	protected $required_params = array(
		'application_name',
		'application_secret'
	);

	public function act()
	{
		$this->init_param(Const_Code::APPLICATION_PARAM_ERROR, '应用传递参数错误');
		// 客户端在全局范围内唯一，如果重复返回400
		if (LF\M('V2.Application')->is_name_exists($this->params['application_name'])) {
			$this->return_400(Const_Code::ADD_APPLICATION_EXISTS, '应用名称重复');
		}
		// 添加应用
		LF\M('V2.Application')->add(array(
			'name' => $this->params['application_name'],
			'secret' => $this->params['application_secret']
		));
		// 取回插入的应用ID，用以回载到页面
		$application_id = LF\M('V2.Application')->is_name_exists($this->params['application_name']);
		if (!$application_id) { // 未找到ID返回400
			$this->return_400(Const_Code::ADD_APPLICATION_FAIL, '应用添加失败');
		}
		$this->log('添加应用: ID-' . $application_id . ' ' . $this->params['application_name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, $application_id);
	}
}
