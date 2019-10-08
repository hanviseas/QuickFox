<?php

use Lazybug\Framework as LF;

/**
 * Controller 更新接口
 */
class Controller_V2_Api_Item_Update extends Controller_V2_Api_Item_Base
{
	protected $request_params = array(
		'item_id' => 'int',
		'item_name' => 'string',
		'request_url' => 'string'
	);

	protected $required_params = array(
		'item_id',
		'item_name',
		'request_url'
	);

	public function act()
	{
		$this->init_param(Const_Code::ITEM_PARAM_ERROR, '接口传递参数错误');
		if ($this->params['item_id'] <= 3 && LF\lb_read_system('demo') === true) {
			$this->return_400(Const_Code::ITEM_PARAM_ERROR, '演示模式下内置接口不能修改');
		}
		$item = LF\M('V2.Space.Item')->get_by_id($this->params['item_id']);
		if (!$item) { // 未找到接口返回400
			$this->return_404(Const_Code::ITEM_NOT_FOUND, '接口未找到');
		}
		// 名称在空间范围内唯一，如果重复返回400
		if (LF\M('V2.Space.Item')->is_name_exists_in_space((int) $item['space_id'], $this->params['item_name'], $this->params['item_id'])) {
			$this->return_400(Const_Code::UPDATE_ITEM_EXISTS, '接口名称重复');
		}
		// 更新接口
		$return = LF\M('V2.Space.Item')->modify_by_id($this->params['item_id'], array(
			'name' => $this->params['item_name'],
			'url' => $this->params['request_url']
		));
		if (is_null($return)) { // 无更新返回400
			$this->return_400(Const_Code::UPDATE_ITEM_FAIL, '接口更新失败');
		}
		$this->log('更新接口: ID-' . $this->params['item_id'] . ' ' . $item['name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '接口更新成功');
	}
}
