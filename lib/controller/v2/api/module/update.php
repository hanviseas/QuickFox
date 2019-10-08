<?php

use Lazybug\Framework as LF;

/**
 * Controller 更新模块
 */
class Controller_V2_Api_Module_Update extends Controller_V2_Api_Module_Base
{
	protected $request_params = array(
		'module_id' => 'int',
		'module_name' => 'string'
	);

	protected $required_params = array(
		'module_id',
		'module_name'
	);

	public function act()
	{
		$this->init_param(Const_Code::MODULE_PARAM_ERROR, '模块传递参数错误');
		$module = LF\M('V2.Space.Module')->get_by_id($this->params['module_id']);
		if (!$module) { // 未找到模块返回400
			$this->return_404(Const_Code::MODULE_NOT_FOUND, '模块未找到');
		}
		// 名称在空间范围内唯一，如果重复返回400
		if (LF\M('V2.Space.Module')->is_name_exists_in_space((int) $module['space_id'], $this->params['module_name'], $this->params['module_id'])) {
			$this->return_400(Const_Code::UPDATE_MODULE_EXISTS, '模块名称重复');
		}
		// 更新模块
		$return = LF\M('V2.Space.Module')->modify_by_id($this->params['module_id'], array(
			'name' => $this->params['module_name']
		));
		if (is_null($return)) { // 无更新返回400
			$this->return_400(Const_Code::UPDATE_MODULE_FAIL, '模块更新失败');
		}
		$this->log('更新模块: ID-' . $this->params['module_id'] . ' ' . $module['name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '模块更新成功');
	}
}
