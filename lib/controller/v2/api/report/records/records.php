<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取报告记录
 */
class Controller_V2_Api_Report_Records_Records extends Controller_V2_Api_Report_Base
{
	protected $request_params = array(
		'page' => 'int',
		'size' => 'int',
		'report_id' => 'int',
		'item_id' => 'int',
		'case_id' => 'int',
		'result' => 'string'
	);

	public function act()
	{
		$this->init_param();
		$report = LF\M('V2.Report')->get_by_id($this->params['report_id']);
		if (!$report) { // 未找到报告返回400
			$this->return_404(Const_Code::REPORT_NOT_FOUND, '报告未找到');
		}
		$record_model = LF\M('V2.Report.Record');
		$record_model->set_table_name($report['submeter']); // 分表查询
		if ($this->params['item_id'] > 0 & $this->params['case_id'] > 0) { // 步骤报告
			$records = $record_model->get_by_report_and_case($this->params['report_id'], $this->params['item_id'], $this->params['case_id']);
		} else if ($this->params['item_id'] > 0) { // 用例报告
			$records = $record_model->get_by_report_and_item($this->params['report_id'], $this->params['item_id']);
		} else { // 接口报告
			if ($this->params['result'] !== '') { // 以特定结果条件筛选
				$records = $record_model->get_by_report_and_result($this->params['report_id'], (int) $this->params['result'], $this->params['page'], $this->params['size']);
			} else { // 获取全部记录
				$records = $record_model->get_by_report_and_result($this->params['report_id'], null, $this->params['page'], $this->params['size']);
			}
		}
		$this->set_json_response($records);
	}
}
