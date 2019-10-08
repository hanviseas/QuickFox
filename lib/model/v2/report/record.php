<?php

/**
 * Model 记录模型
 */
class Model_V2_Report_Record extends Model_V2_Report_Base
{
	protected $table_name = 'record';

	/**
	 * 获取表名（用于分表查询）
	 *
	 * @return string $table_name 表名
	 */
	public function get_table_name()
	{
		return $this->table_name;
	}

	/**
	 * 设置表名（用于分表存储）
	 *
	 * @param string $table_suffix 表后缀
	 */
	public function set_table_name($table_suffix)
	{
		$this->table_name .= ('_' . $table_suffix);
	}

	/**
	 * 根据报告和测试结果获取记录集合
	 *
	 * @param int $report_id 报告ID
	 * @param int $result 测试结果
	 * @return records 记录集合
	 */
	public function get_by_report_and_result($report_id, $result = null, $page = 0, $size = 0)
	{
		$where = array(
			'report_id' => $report_id,
			'item_id' => array(
				'>',
				0
			),
			'case_id' => 0,
			'step_id' => 0
		);
		if ($result !== null) {
			$where['pass'] = (int) $result;
		}
		return $this->get_collection_with_total($page, $size, $where);
	}

	/**
	 * 根据报告和接口获取记录集合
	 *
	 * @param int $report_id 报告ID
	 * @param int $item_id 接口ID
	 * @return records 记录集合
	 */
	public function get_by_report_and_item($report_id, $item_id)
	{
		$where = array(
			'report_id' => $report_id,
			'item_id' => $item_id,
			'case_id' => array(
				'>',
				0
			),
			'step_id' => 0
		);
		return $this->get_collection($where);
	}

	/**
	 * 根据报告和用例获取记录集合
	 *
	 * @param int $report_id 报告ID
	 * @param int $item_id 接口ID
	 * @param int $case_id 用例ID
	 * @return records 记录集合
	 */
	public function get_by_report_and_case($report_id, $item_id, $case_id)
	{
		$where = array(
			'report_id' => $report_id,
			'item_id' => $item_id,
			'case_id' => $case_id,
			'step_id' => array(
				'<>',
				0
			)
		);
		return $this->get_collection($where);
	}

	/**
	 * 检查测试是否失败
	 *
	 * @param int $report_id 报告ID
	 * @param int $item_id 接口ID
	 * @param int $case_id 用例ID
	 * @return status 测试状态
	 */
	public function is_test_fail($report_id, $item_id, $case_id)
	{
		$where = array(
			'report_id' => $report_id,
			'item_id' => $item_id,
			'case_id' => $case_id,
			'step_id' => 1,
			'pass' => 0
		);
		return $this->get_collection($where) ? 1 : 0;
	}
}
