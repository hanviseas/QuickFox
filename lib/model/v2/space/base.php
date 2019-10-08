<?php

/**
 * Model 空间化数据基础模型
 */
abstract class Model_V2_Space_Base extends Model_V2_Base
{
	/**
	 * 根据空间获取数据集合
	 *
	 * @param int $space_id 空间ID
	 * @param int $page 第N页
	 * @param int $size 每页的大小
	 * @param array $where 过滤条件
	 * @param array $order 排序条件
	 * @return $collection 数据集合
	 */
	public function get_by_space($space_id, $page = 0, $size = 0, $where = array(), $order = array())
	{
		$where = array_merge($where, array(
			'space_id' => $space_id
		));
		if ($page && $size) {
			return $this->get_collection_with_total($page, $size, $where, $order);
		}
		return $this->get_collection($where, $order);
	}

	/**
	 * 根据空间获取数据总数
	 *
	 * @param int $space_id 空间ID
	 * @param array $where 过滤条件
	 * @return $total 数据总数
	 */
	public function get_total_by_space($space_id, $where = array())
	{
		$where = array_merge($where, array(
			'space_id' => $space_id
		));
		return $this->get_total($where);
	}

	/**
	 * 根据名称获取数据
	 *
	 * @param int $space_id 空间ID
	 * @param string $name 名称
	 * @return $row 数据行
	 */
	public function get_by_name_in_space($space_id, $name)
	{
		$where = array(
			'space_id' => $space_id,
			'name' => $name
		);
		return $this->get_one_row($where);
	}

	/**
	 * 检查名称是否存在
	 *
	 * @param int $space_id 空间ID
	 * @param string $name 名称
	 * @param int $exclude_id 排除的ID
	 * @return $id 数据行ID或0
	 */
	public function is_name_exists_in_space($space_id, $name, $exclude_id = null)
	{
		return $this->is_exists(array(
			'space_id' => $space_id,
			'name' => $name
		), $exclude_id);
	}

	/**
	 * 根据空间删除数据
	 *
	 * @param int $space_id 空间ID
	 */
	public function remove_by_space($space_id)
	{
		$where = array(
			'space_id' => $space_id
		);
		return $this->remove($where);
	}
}
