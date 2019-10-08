<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取模块统计数值
 */
class Controller_V2_Api_Module_Statistics_Statistics extends Controller_V2_Api_Module_Base
{
	protected $request_params = array(
		'space_id' => 'int',
		'module_id' => 'int'
	);

	public function act()
	{
		$this->init_param();
		if ($this->params['module_id'] > 0 && !LF\M('V2.Space.Module')->get_by_id($this->params['module_id'])) { // 未找到模块返回400
			$this->return_404(Const_Code::MODULE_NOT_FOUND, '模块未找到');
		}
		// 如果模块ID为0，代表统计整个空间的接口和用例数值，否则统计模块的接口和用例数值
		if ($this->params['module_id'] > 0) {
			$item_num = LF\M('V2.Space.Item')->get_total_by_module($this->params['module_id']);
			$case_num = LF\M('V2.Space.Case')->get_total_by_module($this->params['module_id']);
		} else if ($this->params['module_id'] === 0) {
			$item_num = LF\M('V2.Space.Item')->get_total_by_unset_module($this->params['space_id']);
			$case_num = LF\M('V2.Space.Case')->get_total_by_unset_module($this->params['space_id']);
		} else {
			$item_num = LF\M('V2.Space.Item')->get_total_by_space($this->params['space_id']);
			$case_num = LF\M('V2.Space.Case')->get_total_by_space($this->params['space_id']);
		}
		$this->set_json_response(array(
			'item_num' => $item_num,
			'case_num' => $case_num
		));
	}
}
