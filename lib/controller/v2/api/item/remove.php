<?php

use Lazybug\Framework as LF;

/**
 * Controller 删除接口
 */
class Controller_V2_Api_Item_Remove extends Controller_V2_Api_Item_Base
{
	protected $request_params = array(
		'item_id' => 'int'
	);

	protected $required_params = array(
		'item_id'
	);

	public function act()
	{
		$this->init_param(Const_Code::ITEM_PARAM_ERROR, '接口传递参数错误');
		if ($this->params['item_id'] <= 3 && LF\lb_read_system('demo') === true) {
			$this->return_400(Const_Code::ITEM_PARAM_ERROR, '演示模式下内置接口不能删除');
		}
		$item = LF\M('V2.Space.Item')->get_by_id($this->params['item_id']);
		if (!$item) { // 未找到接口返回400
			$this->return_404(Const_Code::ITEM_NOT_FOUND, '接口未找到');
		}
		// 清除所有接口用例和步骤
		$cases = LF\M('V2.Space.Case')->get_by_item($this->params['item_id']);
		foreach ($cases as $case) {
			LF\M('V2.Space.Step')->remove_by_case((int) $case['id']);
		}
		LF\M('V2.Space.Case')->remove_by_item($this->params['item_id']);
		LF\M('V2.Space.Item')->remove_by_id($this->params['item_id']);
		// 尝试取回数据，如果取回成功返回400
		if (LF\M('V2.Space.Item')->get_by_id($this->params['item_id'])) {
			$this->return_400(Const_Code::DELETE_ITEM_FAIL, '接口删除失败');
		}
		$this->log('删除接口: ID-' . $this->params['item_id'] . ' ' . $item['name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '接口删除成功');
	}
}
