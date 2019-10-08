<?php

/**
 * Model 用例模型
 */
class Model_V2_Space_Case extends Model_V2_Space_Base
{
	protected $table_name = 'case';

	/**
	 * 根据接口获取用例集合
	 *
	 * @param int $item_id 接口ID
	 * @param array $where 过滤条件
	 * @param array $order 排序条件
	 * @return $cases 用例集合
	 */
	public function get_by_item($item_id, $page = 0, $size = 0, $where = array(), $order = array())
	{
		$where = array_merge($where, array(
			'item_id' => $item_id
		));
		if ($page && $size) {
			return $this->get_collection_with_total($page, $size, $where, $order);
		}
		return $this->get_collection($where, $order);
	}

	/**
	 * 根据接口和用例等级获取用例集合
	 *
	 * @param int $item_id 接口ID
	 * @return $cases 用例集合
	 */
	public function get_by_item_and_level($item_id, $level, $page = 0, $size = 0, $order = array())
	{
		$where = array(
			'item_id' => $item_id,
			'level' => array(
				'<=',
				$level
			)
		);
		if ($page && $size) {
			return $this->get_collection_with_total($page, $size, $where, $order);
		}
		return $this->get_collection($where);
	}

	/**
	 * 根据模块获取用例总数
	 *
	 * @param int $module_id 模块ID
	 * @return $total 用例总数
	 */
	public function get_total_by_module($module_id)
	{
		$where = array(
			'module_id' => $module_id
		);
		return $this->get_total($where);
	}

	/**
	 * 获取未设置模块用例总数
	 *
	 * @param int $space_id 空间ID
	 * @return $total 用例总数
	 */
	public function get_total_by_unset_module($space_id)
	{
		$where = array(
			'space_id' => $space_id,
			'module_id' => 0
		);
		return $this->get_total($where);
	}

	/**
	 * 根据名称获取用例
	 *
	 * @param int $item_id 接口ID
	 * @param string $name 名称
	 * @return $case 用例
	 */
	public function get_by_name_in_item($item_id, $name)
	{
		$where = array(
			'item_id' => $item_id,
			'name' => $name
		);
		return $this->get_one_row($where);
	}

	/**
	 * 检查名称是否存在
	 *
	 * @param int $item_id 接口ID
	 * @param string $name 名称
	 * @param int $exclude_id 排除的ID
	 * @return $id 用例ID或0
	 */
	public function is_name_exists_in_item($item_id, $name, $exclude_id = null)
	{
		return $this->is_exists(array(
			'item_id' => $item_id,
			'name' => $name
		), $exclude_id);
	}

	/**
	 * 切换模块
	 *
	 * @param int $item_id 接口ID
	 * @param int $target_space_id 目标空间ID
	 * @param int $target_module_id 目标模块ID
	 */
	public function switch_our_module($item_id, $target_space_id, $target_module_id)
	{
		$where = array(
			'item_id' => $item_id
		);
		$update = array(
			'space_id' => $target_space_id,
			'module_id' => $target_module_id
		);
		return $this->modify($where, $update);
	}

	/**
	 * 重置模块
	 *
	 * @param int $source_module_id 源模块ID
	 */
	public function reset_our_module($module_id)
	{
		$where = array(
			'module_id' => $module_id
		);
		$update = 'module_id=0';
		return $this->modify($where, $update);
	}

	/**
	 * 设置等级
	 *
	 * @param int $id 用例ID
	 * @param int $level 等级
	 */
	public function set_my_level($id, $level)
	{
		$where = array(
			'id' => $id
		);
		$update = array(
			'level' => $level
		);
		return $this->modify($where, $update);
	}

	/**
	 * 根据接口删除用例
	 *
	 * @param int $item_id 接口ID
	 */
	public function remove_by_item($item_id)
	{
		$where = array(
			'item_id' => $item_id
		);
		return $this->remove($where);
	}
}
