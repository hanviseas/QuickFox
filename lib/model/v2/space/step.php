<?php

/**
 * Model 步骤模型
 */
class Model_V2_Space_Step extends Model_V2_Space_Base
{
	protected $table_name = 'step';

	/**
	 * 根据用例获取步骤集合
	 *
	 * @param int $case_id 用例ID
	 * @return $steps 步骤集合
	 */
	public function get_by_case($case_id)
	{
		$where = array(
			'case_id' => $case_id
		);
		$order = array(
			'sequence' => 'asc'
		);
		return $this->get_collection($where, $order);
	}

	/**
	 * 根据用例删除步骤
	 *
	 * @param int $case_id 用例ID
	 */
	public function remove_by_case($case_id)
	{
		$where = array(
			'case_id' => $case_id
		);
		return $this->remove($where);
	}
}
