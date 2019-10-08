<?php

use Lazybug\Framework as LF;

/**
 * Controller 删除数据源
 */
class Controller_V2_Api_Data_Remove extends Controller_V2_Api_Data_Base
{
	protected $request_params = array(
		'data_id' => 'int'
	);

	protected $required_params = array(
		'data_id'
	);

	public function act()
	{
		$this->init_param(Const_Code::DATA_PARAM_ERROR, '数据源传递参数错误');
		if ($this->params['data_id'] === 1 && LF\lb_read_system('demo') === true) {
			$this->return_400(Const_Code::DATA_PARAM_ERROR, '演示模式下内置数据源不能删除');
		}
		$data = LF\M('V2.Environment.Data')->get_by_id($this->params['data_id']);
		if (!$data) { // 未找到数据源返回400
			$this->return_404(Const_Code::DATA_NOT_FOUND, '数据源未找到');
		}
		LF\M('V2.Environment.Data')->remove_by_id($this->params['data_id']);
		// 尝试取回数据，如果取回成功返回400
		if (LF\M('V2.Environment.Data')->get_by_id($this->params['data_id'])) {
			$this->return_400(Const_Code::DELETE_DATA_FAIL, '数据源删除失败');
		}
		$this->log('删除数据源: ID-' . $this->params['data_id'] . ' ' . $data['keyword']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '数据源删除成功');
	}
}
