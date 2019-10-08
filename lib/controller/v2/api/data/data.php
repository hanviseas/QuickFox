<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取数据源信息
 */
class Controller_V2_Api_Data_Data extends Controller_V2_Api_Data_Base
{
	protected $request_params = array(
		'data_id' => 'int'
	);

	public function act()
	{
		$this->init_param();
		$data = LF\M('V2.Environment.Data')->get_by_id($this->params['data_id']);
		if (!$data) { // 未找到数据源返回400
			$this->return_404(Const_Code::DATA_NOT_FOUND, '数据源未找到');
		}
		$this->set_json_response($data);
	}
}
