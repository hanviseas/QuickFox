<?php

namespace Lazybug\Framework;

// +------------------------------------------------------------
// | Driver PDOStatement
// +------------------------------------------------------------
// | PDOStatement方法封装
// +------------------------------------------------------------
// | Author : yuanhang.chen@gmail.com
// +------------------------------------------------------------
class Driver_Db_Pdostatement extends \PDOStatement
{
	/**
	 * 构造函数
	 *
	 * @access private
	 */
	private function __construct()
	{ }

	/**
	 * 执行查询
	 *
	 * @access public
	 * @param array $params 查询参数
	 * @return bool $execute 执行结果
	 */
	public function execute($params = array())
	{
		return parent::execute($params);
	}

	/**
	 * 获得错误码
	 *
	 * @access public
	 * @return string $code 错误码
	 */
	public function get_error_code()
	{
		return parent::errorCode();
	}

	/**
	 * 获得错误信息
	 *
	 * @access public
	 * @return array $info 错误信息
	 */
	public function get_error_info()
	{
		return parent::errorInfo();
	}

	/**
	 * 获得行数
	 *
	 * @access public
	 * @return int $count 统计行数
	 */
	public function get_row_count()
	{
		return parent::rowCount();
	}

	/**
	 * 获得列数
	 *
	 * @access public
	 * @return int $count 统计列数
	 */
	public function get_column_count()
	{
		return parent::columnCount();
	}

	/**
	 * 获取所有返回
	 *
	 * @access public
	 * @return array $rows 数据集
	 */
	public function fetch_all()
	{
		return parent::fetchAll();
	}

	/**
	 * 获取单行返回
	 *
	 * @access public
	 * @return array $row 数据行
	 */
	public function fetch_row()
	{
		return parent::fetch();
	}

	/**
	 * 获取单列返回
	 *
	 * @access public
	 * @param int $column_num 列号
	 * @return string $column 数据列
	 */
	public function fetch_column($column_num = 0)
	{
		return parent::fetchColumn($column_num);
	}

	/**
	 * 获取对象返回
	 *
	 * @access public
	 * @param string $class_name 创建类名
	 * @return object $object 数据对象
	 */
	public function fetch_object($class_name = 'stdClass')
	{
		return parent::fetchObject($class_name);
	}
}
