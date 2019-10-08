<?php

use Lazybug\Framework as LF;

/**
 * Controller 删除模块
 */
class Controller_V2_Api_Module_Remove extends Controller_V2_Api_Module_Base
{
	protected $request_params = array(
		'module_id' => 'int'
	);

	protected $required_params = array(
		'module_id'
	);

	public function act()
	{
		$this->init_param(Const_Code::MODULE_PARAM_ERROR, '模块传递参数错误');
		$module = LF\M('V2.Space.Module')->get_by_id($this->params['module_id']);
		if (!$module) { // 未找到模块返回400
			$this->return_404(Const_Code::MODULE_NOT_FOUND, '模块未找到');
		}
		// 重置所有模块接口和用例
		LF\M('V2.Space.Item')->reset_our_module($this->params['module_id']);
		LF\M('V2.Space.Case')->reset_our_module($this->params['module_id']);
		LF\M('V2.Space.Module')->remove_by_id($this->params['module_id']);
		// 尝试取回数据，如果取回成功返回400
		if (LF\M('V2.Space.Module')->get_by_id($this->params['module_id'])) {
			$this->return_400(Const_Code::DELETE_MODULE_FAIL, '模块删除失败');
		}
		$this->log('删除模块: ID-' . $this->params['module_id'] . ' ' . $module['name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '模块删除成功');
	}
}
