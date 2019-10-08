<?php

/**
 * Model 接口模型
 */
class Model_V2_Space_Item extends Model_V2_Space_Base
{
	protected $table_name = 'item';

	/**
	 * 根据模块获取接口集合
	 *
	 * @param int $module_id 模块ID
	 * @param int $page 第N页
	 * @param int $size 每页的大小
	 * @param array $where 过滤条件
	 * @param array $order 排序条件
	 * @return $items 接口集合
	 */
	public function get_by_module($module_id, $page = 0, $size = 0, $where = array(), $order = array())
	{
		$where = array_merge($where, array(
			'module_id' => $module_id
		));
		if ($page && $size) {
			return $this->get_collection_with_total($page, $size, $where, $order);
		}
		return $this->get_collection($where, $order);
	}

	/**
	 * 获取未设置模块接口集合
	 *
	 * @param int $space_id 空间ID
	 * @param int $page 第N页
	 * @param int $size 每页的大小
	 * @param array $where 过滤条件
	 * @param array $order 排序条件
	 * @return $items 接口集合
	 */
	public function get_by_unset_module($space_id, $page = 0, $size = 0, $where = array(), $order = array())
	{
		$where = array_merge($where, array(
			'space_id' => $space_id,
			'module_id' => 0
		));
		if ($page && $size) {
			return $this->get_collection_with_total($page, $size, $where, $order);
		}
		return $this->get_collection($where, $order);
	}

	/**
	 * 根据模块获取接口总数
	 *
	 * @param int $module_id 模块ID
	 * @param array $where 过滤条件
	 * @return $total 接口总数
	 */
	public function get_total_by_module($module_id, $where = array())
	{
		$where = array_merge($where, array(
			'module_id' => $module_id
		));
		return $this->get_total($where);
	}

	/**
	 * 获取未设置模块接口总数
	 *
	 * @param int $module_id 模块ID
	 * @param array $where 过滤条件
	 * @return $total 接口总数
	 */
	public function get_total_by_unset_module($space_id, $where = array())
	{
		$where = array_merge($where, array(
			'space_id' => $space_id,
			'module_id' => 0
		));
		return $this->get_total($where);
	}

	/**
	 * 切换模块
	 *
	 * @param int $id 接口ID
	 * @param int $target_space_id 目标空间ID
	 * @param int $target_module_id 目标模块ID
	 */
	public function switch_my_module($id, $target_space_id, $target_module_id)
	{
		$where = array(
			'id' => $id
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
}
