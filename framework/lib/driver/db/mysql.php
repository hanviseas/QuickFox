<?php

namespace Lazybug\Framework;

// +------------------------------------------------------------
// | Driver MySQL驱动
// +------------------------------------------------------------
// | MySQL数据库连接、查询和关闭
// +------------------------------------------------------------
// | Author : yuanhang.chen@gmail.com
// +------------------------------------------------------------
class Driver_Db_Mysql implements Driver_Db_Interface
{
	/**
	 * 数据库连接
	 *
	 * @access private
	 * @var object $mysql_connect 数据库连接
	 */
	private $mysql_connect = null;

	/**
	 * 连接数据库
	 *
	 * @access public
	 * @param string $host 主机地址
	 * @param string $dbname 数据库名
	 * @param string $user 连接帐户
	 * @param string $password 连接密码
	 * @param string $charset 字符集
	 * @return object $mysql 连接对象
	 */
	public function connect($host = 'localhost', $dbname = 'default', $user = 'root', $password = '', $charset = 'utf8')
	{
		$this->mysql_connect = new Driver_Db_Pdo('mysql:host=' . $host . ';dbname=' . $dbname, $user, $password);
		$this->mysql_connect->setAttribute(\PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
		$this->mysql_connect->setAttribute(\PDO::ATTR_EMULATE_PREPARES, false);
		$this->mysql_connect->query('set names ' . $charset);
		return $this;
	}

	/**
	 * 查询数据库
	 *
	 * @access public
	 * @param string $statement 查询语句
	 * @param array $params 查询参数
	 * @return object $stmt 预处理对象
	 */
	public function query($statement, $params = array())
	{
		$stmt = $this->mysql_connect->prepare($statement);
		$stmt->execute((array) $params);
		return $stmt;
	}

	/**
	 * 关闭数据库
	 *
	 * @access public
	 */
	public function close()
	{
		$this->mysql_connect = null;
	}
}
