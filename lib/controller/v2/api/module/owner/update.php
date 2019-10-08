<?php

use Lazybug\Framework as LF;

/**
 * Controller 设置模块维护人
 */
class Controller_V2_Api_Module_Owner_Update extends Controller_V2_Api_Module_Base
{
	protected $request_params = array(
		'module_id' => 'int',
		'owner_id' => 'int'
	);

	protected $required_params = array(
		'module_id',
		'owner_id'
	);

	public function act()
	{
		$this->init_param(Const_Code::MODULE_PARAM_ERROR, '模块传递参数错误');
		$module = LF\M('V2.Space.Module')->get_by_id($this->params['module_id']);
		if (!$module) { // 未找到模块返回400
			$this->return_404(Const_Code::MODULE_NOT_FOUND, '模块未找到');
		}
		// 更新模块
		$return = LF\M('V2.Space.Module')->modify_by_id($this->params['module_id'], array(
			'owner_id' => $this->params['owner_id']
		));
		if (is_null($return)) { // 无更新返回400
			$this->return_400(Const_Code::UPDATE_MODULE_FAIL, '模块维护人更新失败');
		}
		$this->log('更新模块维护人: ID-' . $this->params['module_id'] . ' ' . $module['name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '模块维护人更新成功');
	}
}
