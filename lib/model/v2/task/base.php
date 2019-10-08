<?php

/**
 * Model 任务化数据模型
 */
abstract class Model_V2_Task_Base extends Model_V2_Base
{
	/**
	 * 根据任务获取数据集合
	 *
	 * @param int $task_id 任务ID
	 * @param int $page 第N页
	 * @param int $size 每页的大小
	 * @param array $where 过滤条件
	 * @param array $order 排序条件
	 * @return $collection 数据集合
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
	 * 根据任务删除数据
	 *
	 * @param int $task_id 任务ID
	 */
	public function remove_by_task($task_id)
	{
		$where = array(
			'task_id' => $task_id
		);
		return $this->remove($where);
	}
}
