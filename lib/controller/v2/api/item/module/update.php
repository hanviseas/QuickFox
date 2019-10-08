<?php

use Lazybug\Framework as LF;

/**
 * Controller 设置接口模块
 */
class Controller_V2_Api_Item_Module_Update extends Controller_V2_Api_Item_Base
{
	protected $request_params = array(
		'item_id' => 'int',
		'module_id' => 'int'
	);

	protected $required_params = array(
		'item_id',
		'module_id'
	);

	public function act()
	{
		$this->init_param(Const_Code::ITEM_PARAM_ERROR, '接口传递参数错误');
		$item = LF\M('V2.Space.Item')->get_by_id($this->params['item_id']);
		if (!$item) { // 未找到接口返回400
			$this->return_404(Const_Code::ITEM_NOT_FOUND, '接口未找到');
		}
		// 获取模块
		if ($this->params['module_id'] === 0) { // 模块ID设为0表示不属于任何模块
			$module['space_id'] = (int) $item['space_id'];
		} else {
			$module = LF\M('V2.Space.Module')->get_by_id($this->params['module_id']);
			if (!$module) { // 未找到模块返回400
				$this->return_404(Const_Code::MODULE_NOT_FOUND, '模块未找到');
			}
		}
		// 更新接口
		$return = LF\M('V2.Space.Item')->switch_my_module($this->params['item_id'], (int) $module['space_id'], $this->params['module_id']);
		// 用例所属模块需要一并更新，涉及到计数
		LF\M('V2.Space.Case')->switch_our_module($this->params['item_id'], (int) $module['space_id'], $this->params['module_id']);
		if (is_null($return)) { // 无更新返回400
			$this->return_400(Const_Code::UPDATE_ITEM_FAIL, '接口模块更新失败');
		}
		$this->log('更新接口模块: ID-' . $this->params['item_id'] . ' ' . $item['name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '接口模块更新成功');
	}
}
