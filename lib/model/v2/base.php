<?php

use Lazybug\Framework\Mod_Model_Relation;

/**
 * Model 基础模型
 */
abstract class Model_V2_Base extends Mod_Model_Relation
{
	/**
	 * 获取一条数据
	 *
	 * @param array $where 限定条件
	 * @param array $order 排序条件
	 * @return $row 数据行
	 */
	public function get_one_row($where = array(), $order = array())
	{
		return $this->select()->where($where)->order($order)->fetch();
	}

	/**
	 * 获取所有数据
	 *
	 * @param array $where 限定条件
	 * @param array $order 排序条件
	 * @return $collection 数据集
	 */
	public function get_collection($where = array(), $order = array())
	{
		return $this->select()->where($where)->order($order)->fetchall();
	}

	/**
	 * 获取所有数据和数据总数
	 *
	 * @param int $page 第N页
	 * @param int $size 每页的大小
	 * @param array $where 限定条件
	 * @param array $order 排序条件
	 * @return $collection 数据集
	 * @return $total 数据总数
	 * @return $page 总页数
	 */
	public function get_collection_with_total($page, $size, $where = array(), $order = array())
	{
		$page = (int) $page > 0 ? (int) $page : 1;
		$size = (int) $size > 0 ? (int) $size : 10;
		$limit = (($page - 1) * $size) . "," . $size; // 计算出查询语句中的limit值
		$collection = $this->select()->where($where)->order($order)->limit($limit)->fetchall();
		$total = $this->select('count(*) as count')->where($where)->fetch();
		return array(
			'collection' => $collection,
			'total' => (int) $total['count'],
			'page' => (int) $total['count'] === 0 ? 1 : ceil((int) $total['count'] / $size)
		);
	}

	/**
	 * 获取数据总数
	 *
	 * @param array $where 限定条件
	 * @return $total 数据总数
	 */
	public function get_total($where = array())
	{
		$return = $this->select('count(*) as count')->where($where)->fetch();
		return (int) $return['count'];
	}

	/**
	 * 根据ID获取数据
	 *
	 * @param int $id 数据ID（唯一索引）
	 * @return $row 数据行
	 */
	public function get_by_id($id)
	{
		$where = array(
			'id' => $id
		);
		return $this->select()->where($where)->fetch();
	}

	/**
	 * 根据名称获取数据
	 *
	 * @param string $name 名称
	 * @return $row 数据行
	 */
	public function get_by_name($name)
	{
		$where = array(
			'name' => $name
		);
		return $this->get_one_row($where);
	}

	/**
	 * 检查数据是否存在
	 *
	 * @param array $where 限定条件
	 * @param int $exclude_id 排除的ID
	 * @return $id 数据行ID或0
	 */
	public function is_exists($where = array(), $exclude_id = null)
	{
		if ($exclude_id !== null) {
			$where = array_merge($where, array(
				'id' => array(
					'<>',
					$exclude_id
				)
			));
		}
		$row = $this->select()->where($where)->fetch();
		return $row ? (int) $row['id'] : 0;
	}

	/**
	 * 检查名称是否存在
	 *
	 * @param string $name 名称
	 * @param int $exclude_id 排除的ID
	 * @return $id 数据行ID或0
	 */
	public function is_name_exists($name, $exclude_id = null)
	{
		return $this->is_exists(array(
			'name' => $name
		), $exclude_id);
	}

	/**
	 * 插入数据
	 *
	 * @param array $insert 插入数据
	 */
	public function add($insert)
	{
		return $this->insert($insert);
	}

	/**
	 * 根据ID更新数据
	 *
	 * @param array $id 数据ID（唯一索引）
	 * @param array $update 更新数据
	 */
	public function modify_by_id($id, $update)
	{
		$where = array(
			'id' => $id
		);
		return $this->where($where)->update($update);
	}

	/**
	 * 更新数据
	 *
	 * @param array $where 限定条件
	 * @param array $update 更新数据
	 */
	public function modify($where, $update)
	{
		return $this->where($where)->update($update);
	}

	/**
	 * 根据ID删除数据
	 *
	 * @param int $id 数据ID（唯一索引）
	 */
	public function remove_by_id($id)
	{
		$where = array(
			'id' => $id
		);
		return $this->where($where)->delete();
	}

	/**
	 * 删除数据
	 *
	 * @param array $where 限定条件
	 */
	public function remove($where)
	{
		return $this->where($where)->delete();
	}
}
