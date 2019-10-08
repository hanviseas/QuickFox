<?php

/**
 * Model 第三方数据基础模型
 */
abstract class Model_V2_Third_Base extends Model_V2_Base
{
	/**
	 * 根据用户获取数据
	 *
	 * @param int $user_id 用户ID
	 * @param array $where 过滤条件
	 * @return $row 数据行
	 */
	public function get_by_user($user_id, $where = array())
	{
		$where = array_merge($where, array(
			'user_id' => $user_id
		));
		return $this->get_one_row($where);
	}
}
