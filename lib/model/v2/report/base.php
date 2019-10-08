<?php

/**
 * Model 报告化数据基础模型
 */
abstract class Model_V2_Report_Base extends Model_V2_Base
{
	/**
	 * 根据报告获取数据集合
	 *
	 * @param int $report_id 报告ID
	 * @param int $page 第N页
	 * @param int $size 每页的大小
	 * @param array $where 过滤条件
	 * @param array $order 排序条件
	 * @return $collection 数据集合
	 */
	public function get_by_report($report_id, $page = 0, $size = 0, $where = array(), $order = array())
	{
		$where = array_merge($where, array(
			'report_id' => $report_id
		));
		if ($page && $size) {
			return $this->get_collection_with_total($page, $size, $where, $order);
		}
		return $this->get_collection($where, $order);
	}

	/**
	 * 根据报告获取数据总数
	 *
	 * @param int $report_id 报告ID
	 * @param array $where 过滤条件
	 * @return $total 数据总数
	 */
	public function get_total_by_report($report_id, $where = array())
	{
		$where = array_merge($where, array(
			'report_id' => $report_id
		));
		return $this->get_total($where);
	}

	/**
	 * 根据报告删除数据
	 *
	 * @param int $report_id 报告ID
	 */
	public function remove_by_report($report_id)
	{
		$where = array(
			'report_id' => $report_id
		);
		return $this->remove($where);
	}
}
