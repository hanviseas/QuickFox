<?php

use Lazybug\Framework as LF;

/**
 * Controller 添加环境
 */
class Controller_V2_Api_Environment_Add extends Controller_V2_Api_Environment_Base
{
	protected $request_params = array(
		'environment_name' => 'string'
	);

	protected $required_params = array(
		'environment_name'
	);

	public function act()
	{
		$this->init_param(Const_Code::ENVIRONMENT_PARAM_ERROR, '环境传递参数错误');
		// 名称在全局范围内唯一，如果重复返回400
		if ($this->params['environment_name'] === '预设配置' || LF\M('V2.Environment')->is_name_exists($this->params['environment_name'])) {
			$this->return_400(Const_Code::ADD_ENVIRONMENT_EXISTS, '环境名称重复');
		}
		// 添加环境
		LF\M('V2.Environment')->add(array(
			'name' => $this->params['environment_name']
		));
		// 取回插入的空间ID，用以回载到页面
		$environment_id = LF\M('V2.Environment')->is_name_exists($this->params['environment_name']);
		if (!$environment_id) { // 未找到ID返回400
			$this->return_400(Const_Code::ADD_ENVIRONMENT_FAIL, '环境添加失败');
		}
		$this->log('添加环境: ID-' . $environment_id . ' ' . $this->params['environment_name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, $environment_id);
	}
}
