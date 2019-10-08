<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取报告信息
 */
class Controller_V2_Api_Report_Report extends Controller_V2_Api_Report_Base
{
	protected $request_params = array(
		'report_id' => 'int'
	);

	public function act()
	{
		$this->init_param();
		$report = LF\M('V2.Report')->get_by_id($this->params['report_id']);
		if (!$report) { // 未找到用户返回400
			$this->return_404(Const_Code::REPORT_NOT_FOUND, '报告未找到');
		}
		$this->set_json_response($report);
	}
}
