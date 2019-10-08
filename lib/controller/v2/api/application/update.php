<?php

use Lazybug\Framework as LF;

/**
 * Controller 更新应用
 */
class Controller_V2_Api_Application_Update extends Controller_V2_Api_Application_Base
{
	protected $request_params = array(
		'application_id' => 'int',
		'application_name' => 'string',
		'application_secret' => 'string'
	);

	protected $required_params = array(
		'application_id',
		'application_name',
		'application_secret'
	);

	public function act()
	{
		$this->init_param(Const_Code::APPLICATION_PARAM_ERROR, '应用传递参数错误');
		$application = LF\M('V2.Application')->get_by_id($this->params['application_id']);
		if (!$application) { // 未找到应用返回400
			$this->return_404(Const_Code::APPLICATION_NOT_FOUND, '应用未找到');
		}
		// 名称在全局范围内唯一，如果重复返回400
		if (LF\M('V2.Application')->is_name_exists($this->params['application_name'], $this->params['application_id'])) {
			$this->return_400(Const_Code::UPDATE_APPLICATION_EXISTS, '应用名称重复');
		}
		// 更新应用
		$return = LF\M('V2.Application')->modify_by_id($this->params['application_id'], array(
			'name' => $this->params['application_name'],
			'secret' =>  $this->params['application_secret']
		));
		if (is_null($return)) { // 无更新返回400
			$this->return_400(Const_Code::UPDATE_APPLICATION_FAIL, '应用更新失败');
		}
		$this->log('更新应用: ID-' . $this->params['application_id'] . ' ' . $application['name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '应用更新成功');
	}
}
