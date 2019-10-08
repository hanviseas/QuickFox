<?php

use Lazybug\Framework as LF;

/**
 * Controller 设置接口维护人
 */
class Controller_V2_Api_Item_Owner_Update extends Controller_V2_Api_Item_Base
{
	protected $request_params = array(
		'item_id' => 'int',
		'owner_id' => 'int'
	);

	protected $required_params = array(
		'item_id',
		'owner_id'
	);

	public function act()
	{
		$this->init_param(Const_Code::ITEM_PARAM_ERROR, '接口传递参数错误');
		$item = LF\M('V2.Space.Item')->get_by_id($this->params['item_id']);
		if (!$item) { // 未找到接口返回400
			$this->return_404(Const_Code::ITEM_NOT_FOUND, '接口未找到');
		}
		// 更新接口
		$return = LF\M('V2.Space.Item')->modify_by_id($this->params['item_id'], array(
			'owner_id' => $this->params['owner_id']
		));
		if (is_null($return)) { // 无更新返回400
			$this->return_400(Const_Code::UPDATE_ITEM_FAIL, '接口维护人更新失败');
		}
		$this->log('更新接口维护人: ID-' . $this->params['item_id'] . ' ' . $item['name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '接口维护人更新成功');
	}
}
