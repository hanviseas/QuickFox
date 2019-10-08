<?php

/**
 * Model 任务模型
 */
class Model_V2_Task extends Model_V2_Base
{
	protected $table_name = 'task';

	/**
	 * 根据执行时间获取任务集合
	 *
	 * @return $tasks 任务集合
	 */
	public function get_by_date()
	{
		$where = array(
			'runtime' => array(
				'<=',
				date('H-i', time())
			),
			'lasttime' => array(
				'<',
				date('Y-m-d', time())
			),
			'suspension' => 0
		);
		return $this->get_collection($where);
	}

	/**
	 * 设置最后执行时间
	 *
	 * @param int $id 任务ID
	 */
	public function set_my_lasttime($id)
	{
		$where = array(
			'id' => $id
		);
		$update = array(
			'lasttime' => date('Y-m-d H:i:s', time())
		);
		return $this->modify($where, $update);
	}

	/**
	 * 设置挂起状态
	 *
	 * @param int $id 用例ID
	 * @param int $suspension 挂起状态
	 */
	public function set_my_suspension($id, $suspension)
	{
		$where = array(
			'id' => $id
		);
		$update = array(
			'suspension' => $suspension
		);
		return $this->modify($where, $update);
	}
}
