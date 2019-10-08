<?php

use Lazybug\Framework as LF;

/**
 * Controller 删除环境
 */
class Controller_V2_Api_Environment_Remove extends Controller_V2_Api_Environment_Base
{
	protected $request_params = array(
		'environment_id' => 'int'
	);

	protected $required_params = array(
		'environment_id'
	);

	public function act()
	{
		$this->init_param(Const_Code::ENVIRONMENT_PARAM_ERROR, '环境传递参数错误');
		$environment = LF\M('V2.Environment')->get_by_id($this->params['environment_id']);
		if (!$environment) { // 未找到环境返回400
			$this->return_404(Const_Code::ENVIRONMENT_NOT_FOUND, '环境未找到');
		}
		// 清除所有环境数据
		LF\M('V2.Environment.Data')->remove_by_environment($this->params['environment_id']);
		LF\M('V2.Environment.Param')->remove_by_environment($this->params['environment_id']);
		LF\M('V2.Environment')->remove_by_id($this->params['environment_id']);
		// 尝试取回数据，如果取回成功返回400
		if (LF\M('V2.Environment')->get_by_id($this->params['environment_id'])) {
			$this->return_400(Const_Code::DELETE_MODULE_FAIL, '环境删除失败');
		}
		$this->log('删除环境: ID-' . $this->params['environment_id'] . ' ' . $environment['name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '环境删除成功');
	}
}
