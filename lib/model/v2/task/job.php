<?php

/**
 * Model 作业模型
 */
class Model_V2_Task_Job extends Model_V2_Task_Base
{
	protected $table_name = 'job';

	/**
	 * 获取一个可执行作业
	 *
	 * @return $job 作业
	 */
	public function get_one_available()
	{
		$where = array(
			'performance' => 0
		);
		return $this->get_one_row($where);
	}

	/**
	 * 检查任务是否存在
	 *
	 * @param int $task_id 任务ID
	 * @return $id 作业ID或0
	 */
	public function is_task_exists($task_id)
	{
		$where = array(
			'task_id' => $task_id
		);
		$row = $this->select()->where($where)->fetch();
		return $row ? (int) $row['task_id'] : 0;
	}

	/**
	 * 检查GUID是否存在
	 *
	 * @param int $guid GUID
	 * @return $id 作业ID或0
	 */
	public function is_guid_exists($guid)
	{
		$where = array(
			'guid' => $guid
		);
		$row = $this->select()->where($where)->fetch();
		return $row ? $row['guid'] : '';
	}

	/**
	 * 设置运行
	 *
	 * @param int $task_id 任务ID
	 */
	public function set_my_performance($task_id)
	{
		$where = array(
			'task_id' => $task_id
		);
		$update = array(
			'performance' => 1
		);
		return $this->modify($where, $update);
	}

	/**
	 * 设置总计数值
	 *
	 * @param int $guid GUID
	 * @param int $total 总计数值
	 */
	public function set_my_total_value($guid, $total)
	{
		$where = array(
			'guid' => $guid
		);
		$update = array(
			'total' => $total
		);
		return $this->modify($where, $update);
	}

	/**
	 * 增加当前数值
	 *
	 * @param int $guid GUID
	 */
	public function increase_my_current_value($guid)
	{
		$where = array(
			'guid' => $guid
		);
		$update = 'current=current+1';
		return $this->modify($where, $update);
	}

	/**
	 * 根据GUID删除作业
	 *
	 * @param int $guid GUID
	 */
	public function remove_by_guid($guid)
	{
		$where = array(
			'guid' => $guid
		);
		return $this->remove($where);
	}

	/**
	 * 清除所有作业
	 */
	public function clear_all()
	{
		return $this->remove(array());
	}
}
