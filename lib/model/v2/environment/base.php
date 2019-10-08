<?php

/**
 * Model 环境化数据基础模型
 */
abstract class Model_V2_Environment_Base extends Model_V2_Base
{
	/**
	 * 根据环境获取数据集合
	 *
	 * @param int $environment_id 环境ID
	 * @param int $page 第N页
	 * @param int $size 每页的大小
	 * @param array $where 过滤条件
	 * @param array $order 排序条件
	 * @return $collection 数据集合
	 */
	public function get_by_environment($environment_id, $page = 0, $size = 0, $where = array(), $order = array())
	{
		$where = array_merge($where, array(
			'environment_id' => $environment_id
		));
		if ($page && $size) {
			return $this->get_collection_with_total($page, $size, $where, $order);
		}
		return $this->get_collection($where, $order);
	}

	/**
	 * 根据环境获取数据总数
	 *
	 * @param int $environment_id 环境ID
	 *  @param array $where 过滤条件
	 * @return $total 数据总数
	 */
	public function get_total_by_environment($environment_id, $where = array())
	{
		$where = array_merge($where, array(
			'environment_id' => $environment_id
		));
		return $this->get_total($where);
	}

	/**
	 * 根据关键字获取数据
	 *
	 * @param int $environment_id 环境ID
	 * @param string $keyword 关键字
	 * @return $row 数据行
	 */
	public function get_by_keyword_in_environment($environment_id, $keyword)
	{
		$where = array(
			'environment_id' => $environment_id,
			'keyword' => $keyword
		);
		return $this->get_one_row($where);
	}

	/**
	 * 检查关键字是否存在
	 *
	 * @param int $environment_id 环境ID
	 * @param string $keyword 关键字
	 * @param int $exclude_id 排除的ID
	 * @return $id 数据行ID或0
	 */
	public function is_keyword_exists_in_environment($environment_id, $keyword, $exclude_id = null)
	{
		return $this->is_exists(array(
			'environment_id' => $environment_id,
			'keyword' => $keyword
		), $exclude_id);
	}

	/**
	 * 根据环境删除数据
	 *
	 * @param int $environment_id 环境ID
	 */
	public function remove_by_environment($environment_id)
	{
		$where = array(
			'environment_id' => $environment_id
		);
		return $this->remove($where);
	}
}
