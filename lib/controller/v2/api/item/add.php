<?php

use Lazybug\Framework as LF;

/**
 * Controller 添加接口
 */
class Controller_V2_Api_Item_Add extends Controller_V2_Api_Item_Base
{
	protected $request_params = array(
		'module_id' => 'int',
		'space_id' => 'int',
		'item_name' => 'string',
		'request_url' => 'string'
	);

	protected $required_params = array(
		'module_id',
		'space_id',
		'item_name',
		'request_url'
	);

	public function act()
	{
		$this->init_param(Const_Code::ITEM_PARAM_ERROR, '接口传递参数错误');
		// 名称在空间范围内唯一，如果重复返回400
		if (LF\M('V2.Space.Item')->is_name_exists_in_space($this->params['space_id'], $this->params['item_name'])) {
			$this->return_400(Const_Code::ADD_ITEM_EXISTS, '接口名称重复');
		}
		// 数据校正
		if ($this->params['module_id'] > 0) {
			$module = LF\M('V2.Space.Module')->get_by_id($this->params['module_id']);
			$this->params['space_id'] = $module ? (int) $module['space_id'] : $this->params['space_id'];
		}
		// 添加接口
		LF\M('V2.Space.Item')->add(array(
			'module_id' => $this->params['module_id'],
			'space_id' => $this->params['space_id'],
			'name' => $this->params['item_name'],
			'url' => $this->params['request_url']
		));
		// 取回插入的接口ID，用以回载到页面
		$item_id = LF\M('V2.Space.Item')->is_name_exists_in_space($this->params['space_id'], $this->params['item_name']);
		if (!$item_id) { // 未找到ID返回400
			$this->return_400(Const_Code::ADD_ITEM_FAIL, '接口添加失败');
		}
		$this->log('添加接口: ID-' . $item_id . ' ' . $this->params['item_name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, $item_id);
	}
}
