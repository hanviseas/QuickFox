<?php

namespace Lazybug\Framework;

// +------------------------------------------------------------
// | Driver PDO
// +------------------------------------------------------------
// | PDO方法封装
// +------------------------------------------------------------
// | Author : yuanhang.chen@gmail.com
// +------------------------------------------------------------
class Driver_Db_Pdo extends \PDO
{
	/**
	 * 构造函数
	 *
	 * @access public
	 * @param string $dsn 数据源
	 * @param string $user 连接帐户
	 * @param string $password 连接密码
	 * @param array $options 选项
	 */
	public function __construct($dsn, $user, $password, $options = array())
	{
		parent::__construct($dsn, $user, $password, $options);
		$this->setAttribute(\PDO::ATTR_TIMEOUT, 30);
		$this->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
		$this->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		$this->setAttribute(\PDO::ATTR_STRINGIFY_FETCHES, false);
		$this->setAttribute(\PDO::ATTR_EMULATE_PREPARES, false);
		$this->setAttribute(\PDO::ATTR_STATEMENT_CLASS, array(
			'\Lazybug\Framework\Driver_Db_Pdostatement',
			array(
				null
			)
		));
	}

	/**
	 * 查询预处理
	 *
	 * @access public
	 * @param string $statement 查询语句
	 * @param array $driver_options 选项
	 * @return object $stmt 预处理对象
	 */
	public function prepare($statement, $driver_options = array())
	{
		return parent::prepare($statement, $driver_options);
	}

	/**
	 * 查询数据
	 *
	 * @access public
	 * @param string $statement 查询语句
	 * @return object $query 查询结果
	 */
	public function query($statement)
	{
		return parent::query($statement);
	}

	/**
	 * 执行更新
	 *
	 * @access public
	 * @param string $statement 执行语句
	 * @return int $exec 执行结果
	 */
	public function exec($statement)
	{
		return parent::exec($statement);
	}
}
