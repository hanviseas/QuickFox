<?php

use Lazybug\Framework as LF;

/**
 * Controller 添加模块
 */
class Controller_V2_Api_Module_Add extends Controller_V2_Api_Module_Base
{
	protected $request_params = array(
		'space_id' => 'int',
		'module_name' => 'string'
	);

	protected $required_params = array(
		'space_id',
		'module_name'
	);

	public function act()
	{
		$this->init_param(Const_Code::MODULE_PARAM_ERROR, '模块传递参数错误');
		// 名称在空间范围内唯一，如果重复返回400
		if (LF\M('V2.Space.Module')->is_name_exists_in_space($this->params['space_id'], $this->params['module_name'])) {
			$this->return_400(Const_Code::ADD_MODULE_EXISTS, '模块名称重复');
		}
		// 添加模块
		LF\M('V2.Space.Module')->add(array(
			'space_id' => $this->params['space_id'],
			'name' => $this->params['module_name']
		));
		// 取回插入的接口ID，用以回载到页面
		$module_id = LF\M('V2.Space.Module')->is_name_exists_in_space($this->params['space_id'], $this->params['module_name']);
		if (!$module_id) { // 未找到ID返回400
			$this->return_400(Const_Code::ADD_MODULE_FAIL, '模块添加失败');
		}
		$this->log('添加模块: ID-' . $module_id . ' ' . $this->params['module_name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, $module_id);
	}
}
