<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取接口用例
 */
class Controller_V2_Api_Item_Cases_Cases extends Controller_V2_Api_Item_Base
{
	protected $request_params = array(
		'page' => 'int',
		'size' => 'int',
		'item_id' => 'int'
	);

	public function act()
	{
		$this->init_param();
		if (!LF\M('V2.Space.Item')->get_by_id($this->params['item_id'])) { // 未找到接口返回400
			$this->return_404(Const_Code::ITEM_NOT_FOUND, '接口未找到');
		}
		$cases = LF\M('V2.Space.Case')->get_by_item($this->params['item_id'], $this->params['page'], $this->params['size']);
		$this->set_json_response($cases);
	}
}
