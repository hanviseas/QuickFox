<?php

use Lazybug\Framework as LF;

/**
 * Controller 更新环境
 */
class Controller_V2_Api_Environment_Update extends Controller_V2_Api_Environment_Base
{
	protected $request_params = array(
		'environment_id' => 'int',
		'environment_name' => 'string'
	);

	protected $required_params = array(
		'environment_id',
		'environment_name'
	);

	public function act()
	{
		$this->init_param(Const_Code::ENVIRONMENT_PARAM_ERROR, '环境传递参数错误');
		$environment = LF\M('V2.Environment')->get_by_id($this->params['environment_id']);
		if (!$environment) { // 未找到环境返回400
			$this->return_404(Const_Code::ENVIRONMENT_NOT_FOUND, '环境未找到');
		}
		// 名称在全局范围内唯一，如果重复返回400
		if ($this->params['environment_name'] === '预设配置' || LF\M('V2.Environment')->is_name_exists($this->params['environment_name'], $this->params['environment_id'])) {
			$this->return_400(Const_Code::UPDATE_ENVIRONMENT_EXISTS, '环境名称重复');
		}
		// 更新环境
		$return = LF\M('V2.Environment')->modify_by_id($this->params['environment_id'], array(
			'name' => $this->params['environment_name']
		));
		if (is_null($return)) { // 无更新返回400
			$this->return_400(Const_Code::UPDATE_ENVIRONMENT_FAIL, '环境更新失败');
		}
		$this->log('更新环境: ID-' . $this->params['environment_id'] . ' ' . $environment['name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '环境更新成功');
	}
}
