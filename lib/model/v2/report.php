<?php

/**
 * Model 报告模型
 */
class Model_V2_Report extends Model_V2_Base
{
	protected $table_name = 'report';

	/**
	 * 根据任务获取报告集合
	 *
	 * @param int $task_id 任务ID
	 * @param int $page 第N页
	 * @param int $size 每页的大小
	 * @param array $where 过滤条件
	 * @param array $order 排序条件
	 * @return $reports 报告集合
	 */
	public function get_by_task($task_id, $page = 0, $size = 0, $where = array(), $order = array())
	{
		$where = array_merge($where, array(
			'task_id' => $task_id
		));
		if ($page && $size) {
			return $this->get_collection_with_total($page, $size, $where, $order);
		}
		return $this->get_collection($where, $order);
	}

	/**
	 * 根据任务获取最后一次报告
	 *
	 * @param int $task_id 任务ID
	 * @return $row 数据行
	 */
	public function get_last_by_task($task_id)
	{
		$where = array(
			'task_id' => $task_id
		);
		$order = array(
			'runtime' => 'desc'
		);
		return $this->get_one_row($where, $order);
	}

	/**
	 * 根据GUID获取报告
	 *
	 * @param int $guid GUID
	 * @return $report 报告
	 */
	public function get_by_guid($guid)
	{
		$where = array(
			'guid' => $guid
		);
		return $this->get_one_row($where);
	}

	/**
	 * 增加通过数值
	 *
	 * @param int $id 报告ID
	 */
	public function increase_my_pass_value($id)
	{
		$where = array(
			'id' => $id
		);
		$update = 'pass=pass+1';
		return $this->modify($where, $update);
	}

	/**
	 * 增加失败数值
	 *
	 * @param int $id 报告ID
	 */
	public function increase_my_fail_value($id)
	{
		$where = array(
			'id' => $id
		);
		$update = 'fail=fail+1';
		return $this->modify($where, $update);
	}

	/**
	 * 更新前置脚本输出
	 *
	 * @param int $id 报告ID
	 * @param string $output 脚本输出
	 */
	public function update_preposition_output($id, $output)
	{
		$where = array(
			'id' => $id
		);
		$update = array(
			'preposition_output' => $output
		);
		return $this->modify($where, $update);
	}

	/**
	 * 更新后置脚本输出
	 *
	 * @param int $id 报告ID
	 * @param string $output 脚本输出
	 */
	public function update_postposition_output($id, $output)
	{
		$where = array(
			'id' => $id
		);
		$update = array(
			'postposition_output' => $output
		);
		return $this->modify($where, $update);
	}
}
